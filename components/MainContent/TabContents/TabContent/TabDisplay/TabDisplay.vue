<template>
  <div :id="`display-${tab.id}`"
  style="position: relative; flex: 1; overflow: hidden"

  @pointerdown.capture="onCapturePointerDown" 
  @pointerdown="onPointerDown"
  
  @wheel="onMouseWheel">



    <DisplaySVG :tab="tab" :module="module">
    </DisplaySVG>



    <DisplayNodes :tab="tab" :module="module">
    </DisplayNodes>


    
    <DisplaySelection :tab="tab">
    </DisplaySelection>



    <DisplayButtons :tab="tab" :module="module">
    </DisplayButtons>



  </div>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
  },



  created() {
    this.$store.commit('saveState')
  },



  mounted() {
    document.addEventListener('pointermove', this.onPointerMove)
    document.addEventListener('pointerup', this.onPointerUp)

    this.$store.commit('fitScreen')
  },



  beforeDestroy() {
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
  },



  
  methods: {



    onCapturePointerDown(event) {
      let pointerPos = _app.getPointerPos(this.tab.id, event)

      this.$set(this.tab.camera.pinch.pointers, event.pointerId, pointerPos)
    },



    onPointerDown(event) {
      if (!event.isPrimary) {
        this.tab.camera.panTimeout = null
        return
      }




      let pointerPos = _app.getPointerPos(this.tab.id, event)



      
      // Panning

      if (event.pointerType !== 'mouse' || event.button === 1) {
        this.tab.camera.panPos = { ...pointerPos }

        if (event.pointerType !== 'mouse') {
          this.tab.camera.panStart = { ...pointerPos }

          this.tab.camera.panTimeout = setTimeout(() => {
            if (this.tab.camera.panTimeout == null)
              return

            this.tab.camera.panPos = null
            this.tab.camera.panTimeout = null

            this.tab.nodes.selection.start = { ...pointerPos }
            this.tab.nodes.selection.end = { ...pointerPos }
          }, 300)
        }
      }



      
      // Node deselection

      if (event.button === 0 && !event.ctrlKey) {
        this.tab.nodes.activeId = null
        this.tab.nodes.selected = {}
      }




      // Selecting

      if (event.pointerType === 'mouse' && event.button === 0) {
        this.tab.nodes.selection.start = { ...pointerPos }
        this.tab.nodes.selection.end = { ...pointerPos }
      }
    },

    
    
    onPointerMove(event) {
      // Compute pointer position

      let pointerPos = _app.getPointerPos(this.tab.id, event)
      
      if (this.tab.camera.pinch.pointers.hasOwnProperty(event.pointerId))
        this.$set(this.tab.camera.pinch.pointers, event.pointerId, pointerPos)



        
      // Pinch zoom

      let pointers = Object.values(this.tab.camera.pinch.pointers)

      if (pointers.length === 2) {
        // Compute center and distance

        let center = {
          x: (pointers[0].x + pointers[1].x) / 2,
          y: (pointers[0].y + pointers[1].y) / 2,
        }

        let distance = Math.sqrt(
          Math.pow(pointers[0].x - pointers[1].x, 2) +
          Math.pow(pointers[0].y - pointers[1].y, 2))




        if (this.tab.camera.pinch.center != null) {
          // Compute ratio

          let ratio = distance / this.tab.camera.pinch.distance




          // Camera position update

          let worldPos = _app.screenToWorld(this.tab, center)

          let centerOffset = {
            x: center.x - this.tab.camera.pinch.center.x,
            y: center.y - this.tab.camera.pinch.center.y,
          }

          this.tab.camera.pos.x = -centerOffset.x / this.tab.camera.zoom +
            worldPos.x + (this.tab.camera.pos.x - worldPos.x) / ratio
          this.tab.camera.pos.y = -centerOffset.y / this.tab.camera.zoom +
            worldPos.y + (this.tab.camera.pos.y - worldPos.y) / ratio



          
          // Camera zoom update
          
          this.tab.camera.zoom = Math.min(Math.max(
            this.tab.camera.zoom * ratio, _app.minZoom), _app.maxZoom)
        }




        this.tab.camera.pinch.center = center
        this.tab.camera.pinch.distance = distance

        return
      }




      if (!event.isPrimary)
        return




      // Panning

      if (this.tab.camera.panPos != null) {
        this.tab.camera.pos.x -= (pointerPos.x - this.tab.camera.panPos.x) / this.tab.camera.zoom
        this.tab.camera.pos.y -= (pointerPos.y - this.tab.camera.panPos.y) / this.tab.camera.zoom
        
        this.tab.camera.panPos = { ...pointerPos }

        if (event.pointerType !== 'mouse' && this.tab.camera.panTimeout != null) {
          let dist = Math.sqrt(
            Math.pow(pointerPos.x - this.tab.camera.panStart.x, 2) +
            Math.pow(pointerPos.y - this.tab.camera.panStart.y, 2))

          if (dist > 5)
            this.tab.camera.panTimeout = null
        }

        return
      }




      // Selecting

      if (this.tab.nodes.selection.start != null) {
        this.tab.nodes.selection.end = { ...pointerPos }

        return
      }




      // Dragging

      if (this.tab.nodes.dragPos != null) {
        for (let nodeId of Object.keys(this.tab.nodes.selected)) {
          let node = this.module.nodes[nodeId]

          node.pos.x += (pointerPos.x - this.tab.nodes.dragPos.x) / this.tab.camera.zoom
          node.pos.y += (pointerPos.y - this.tab.nodes.dragPos.y) / this.tab.camera.zoom
        }

        this.tab.nodes.dragPos = { ...pointerPos }
        this.tab.nodes.dragged = true

        return
      }




      // Linking

      if (this.tab.newLink != null) {
        let worldPos = _app.screenToWorld(this.tab, pointerPos)

        if (typeof(this.tab.newLink.from) === 'number')
          this.tab.newLink.to = { ...worldPos }
        else
          this.tab.newLink.from = { ...worldPos }

        return
      }
    },

    

    onPointerUp(event) {
      let pointerPos = _app.getPointerPos(this.tab.id, event)


      

      // Remove pinch pointer

      if (this.tab.camera.pinch.pointers.hasOwnProperty(event.pointerId)) {
        this.$delete(this.tab.camera.pinch.pointers, event.pointerId)

        if (Object.keys(this.tab.camera.pinch.pointers).length === 1) {
          this.tab.camera.pinch.center = null
          this.tab.camera.pinch.distance = null
        }
      }




      // Panning

      if (this.tab.camera.panPos != null &&
      (event.pointerType !== 'mouse' || event.button === 1)) {
        this.tab.camera.panPos = null
        this.tab.camera.panStart = null
        this.tab.camera.panTimeout = null
      }




      // Selecting

      if (event.button === 0 && this.tab, this.tab.nodes.selection.start != null) {
        let worldStart = _app.screenToWorld(this.tab, this.tab.nodes.selection.start)
        let worldEnd = _app.screenToWorld(this.tab, this.tab.nodes.selection.end)

        let topLeft = {
          x: Math.min(worldStart.x, worldEnd.x),
          y: Math.min(worldStart.y, worldEnd.y),
        }
        let bottomRight = {
          x: Math.max(worldStart.x, worldEnd.x),
          y: Math.max(worldStart.y, worldEnd.y),
        }


        for (let node of Object.values(this.module.nodes)) {
          if (node.pos.x < topLeft.x || node.pos.x > bottomRight.x
          || node.pos.y < topLeft.y || node.pos.y > bottomRight.y)
            continue

          if (this.tab.nodes.selected.hasOwnProperty(node.id))
            this.$delete(this.tab.nodes.selected, node.id)
          else
            this.$set(this.tab.nodes.selected, node.id, true)
        }


        this.tab.nodes.selection.start = null
        this.tab.nodes.selection.end = null
      }




      // Dragging

      if (this.tab.nodes.dragPos != null && event.button === 0) {
        this.tab.nodes.dragPos = null
        
        if (this.tab.nodes.dragged)
          this.$store.commit('saveState')
      }

        


      // Linking
      
      if (this.tab.newLink != null && event.button === 0)
        this.tab.newLink = null
    },
    


    onMouseWheel(event) {
      // Calculate world position

      let pointerPos = _app.getPointerPos(this.tab.id, event)
      let worldPos = _app.screenToWorld(this.tab, pointerPos)




      // Update camera zoom

      let multiplier = event.deltaY > 0 ? (1 / 1.2) : 1.2

      let oldZoom = this.tab.camera.zoom

      this.tab.camera.zoom = Math.min(Math.max(
        this.tab.camera.zoom * multiplier, _app.minZoom), _app.maxZoom)




      // Update camera position

      let ratio = this.tab.camera.zoom / oldZoom

      this.tab.camera.pos = {
        x: worldPos.x + (this.tab.camera.pos.x - worldPos.x) / ratio,
        y: worldPos.y + (this.tab.camera.pos.y - worldPos.y) / ratio,
      }
    },




  },

  

}
</script>

<style>

</style>