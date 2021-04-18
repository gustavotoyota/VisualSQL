<template>
  <div :id="`display-${tab.id}`"
  style="position: relative; flex: 1; overflow: hidden"

  @pointerdown="onPointerDown" @wheel="onMouseWheel">



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



  mounted() {
    document.addEventListener('pointermove', this.onPointerMove)
    document.addEventListener('pointerup', this.onPointerUp)
  },



  beforeDestroy() {
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
  },



  
  methods: {


    onPointerDown(event) {
      document.getElementById(`display-${this.tab.id}`).
        setPointerCapture(event.pointerId)



      // Compute pointer position
      
      let pointerPos = _app.getPointerPos(this.tab.id, event)

      if (event.isPrimary)
        this.tab.camera.touches = {}

      this.$set(this.tab.camera.touches, event.pointerId, pointerPos)




      // Node deselection

      if (event.button === 0 && !event.ctrlKey) {
        this.tab.nodes.active = null
        this.tab.nodes.selected = {}
      }



      // Selecting

      if (event.pointerType === 'mouse' && event.button === 0) {
        this.tab.nodes.selectionStart = { ...pointerPos }
        this.tab.nodes.selectionEnd = { ...pointerPos }
      }



      // Panning

      if (event.pointerType === 'touch' || event.button === 1)
        this.tab.camera.panPos = { ...pointerPos }



      // Pinch zoom

      if (Object.keys(this.tab.camera.touches).length >= 2)
        this.tab.camera.panPos = null
    },

    
    
    onPointerMove(event) {
      // Compute pointer position

      let pointerPos = _app.getPointerPos(this.tab.id, event)
      
      let oldPointerPos = this.tab.camera.touches[event.pointerId]
      
      this.$set(this.tab.camera.touches, event.pointerId, pointerPos)




      // Selecting

      if (this.tab.nodes.selectionStart != null)
        this.tab.nodes.selectionEnd = { ...pointerPos }




      // Dragging

      if (this.tab.nodes.dragPos != null) {
        for (let node of Object.values(this.tab.nodes.selected)) {
          node.pos.x += (pointerPos.x - this.tab.nodes.dragPos.x) / this.tab.camera.zoom
          node.pos.y += (pointerPos.y - this.tab.nodes.dragPos.y) / this.tab.camera.zoom
        }

        this.tab.nodes.dragPos = { ...pointerPos }
      }



      // Linking

      if (this.tab.newLink != null) {
        let worldPos = _app.screenToWorld(this.tab, pointerPos)

        if (typeof(this.tab.newLink.from) === 'number')
          this.tab.newLink.to = { ...worldPos }
        else
          this.tab.newLink.from = { ...worldPos }
      }



      // Panning

      if (this.tab.camera.panPos != null) {
        this.tab.camera.pos.x -= (pointerPos.x - this.tab.camera.panPos.x) / this.tab.camera.zoom
        this.tab.camera.pos.y -= (pointerPos.y - this.tab.camera.panPos.y) / this.tab.camera.zoom
        
        this.tab.camera.panPos = { ...pointerPos }
      }


      
      // Pinch zoom

      if (Object.keys(this.tab.camera.touches).length === 2) {
        // Get other pointer position

        let otherPointerPos
        for (let pointerId of Object.keys(this.tab.camera.touches))
          if (pointerId !== event.pointerId)
            otherPointerPos = this.tab.camera.touches[pointerId]

        if (otherPointerPos == null)
          return




        // Camera position update

        let centerOffset = {
          x: (pointerPos.x + otherPointerPos.x) / 2 - (oldPointerPos.x + otherPointerPos.x) / 2,
          y: (pointerPos.y + otherPointerPos.y) / 2 - (oldPointerPos.y + otherPointerPos.y) / 2,
        }

        this.tab.camera.pos.x += centerOffset.x / this.tab.camera.zoom
        this.tab.camera.pos.y += centerOffset.y / this.tab.camera.zoom



        
        // Camera zoom update

        let oldDist = Math.sqrt(
          Math.pow(oldPointerPos.x - otherPointerPos.x, 2) +
          Math.pow(oldPointerPos.y - otherPointerPos.y, 2))

        if (oldDist === 0)
          return

        let newDist = Math.sqrt(
          Math.pow(pointerPos.x - otherPointerPos.x, 2) +
          Math.pow(pointerPos.y - otherPointerPos.y, 2))

        let zoomRatio = newDist / oldDist
        
        this.tab.camera.zoom /= zoomRatio
      }
    },

    

    onPointerUp(event) {
      // Remove touch

      if (event.pointerId in this.tab.camera.touches)
        this.$delete(this.tab.camera.touches, event.pointerId)



      // Dragging

      if (event.button === 0)
        this.tab.nodes.dragPos = null



      // Selecting

      if (event.button === 0 && this.tab.nodes.selectionStart != null) {
        let worldStart = _app.screenToWorld(this.tab, this.tab.nodes.selectionStart)
        let worldEnd = _app.screenToWorld(this.tab, this.tab.nodes.selectionEnd)

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

          if (node.id in this.tab.nodes.selected)
            this.$delete(this.tab.nodes.selected, node.id)
          else
            this.$set(this.tab.nodes.selected, node.id, node)
        }


        this.tab.nodes.selectionStart = null
        this.tab.nodes.selectionEnd = null
      }

        

      // Linking
      
      if (event.button === 0)
        this.tab.newLink = null



      // Panning

      if (event.pointerType === 'touch' || event.button === 1)
        this.tab.camera.panPos = null
    },
    


    onMouseWheel(event) {
      const MIN_ZOOM = Math.pow(1 / 1.2, 12)
      const MAX_ZOOM = Math.pow(1.2, 12)



      // Calculate world position

      let pointerPos = _app.getPointerPos(this.tab.id, event)
      let worldPos = _app.screenToWorld(this.tab, pointerPos)




      // Update camera zoom

      let multiplier = event.deltaY > 0 ? (1 / 1.2) : 1.2

      let oldZoom = this.tab.camera.zoom

      this.tab.camera.zoom = Math.min(Math.max(
        this.tab.camera.zoom * multiplier, MIN_ZOOM), MAX_ZOOM)




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