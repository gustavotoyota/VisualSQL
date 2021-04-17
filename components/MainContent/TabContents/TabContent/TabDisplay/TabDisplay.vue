<template>
  <div :id="`display-${tab.id}`"
  style="position: relative; flex: 1; overflow: hidden"
  @mousedown="onMouseDown" @wheel="onMouseWheel">



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
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },


  
  methods: {


    onMouseDown(event) {
      let mousePos = _app.getMousePos(this.tab.id, event)



      // Node deselection

      if (event.button === 0 && !event.ctrlKey) {
        this.tab.nodes.active = null
        this.tab.nodes.selected = {}
      }



      // Selecting

      if (event.button === 0) {
        this.tab.nodes.selectionStart = { ...mousePos }
        this.tab.nodes.selectionEnd = { ...mousePos }
      }



      // Panning

      if (event.button === 1)
        this.tab.camera.panPos = { ...mousePos }
    },

    
    
    onMouseMove(event) {
      let mousePos = _app.getMousePos(this.tab.id, event)



      // Selecting

      if ((event.buttons & 1) === 1 && this.tab.nodes.selectionStart != null)
        this.tab.nodes.selectionEnd = { ...mousePos }



      // Dragging

      if ((event.buttons & 1) === 1 && this.tab.nodes.dragPos != null) {
        for (let node of Object.values(this.tab.nodes.selected)) {
          node.pos.x += (mousePos.x - this.tab.nodes.dragPos.x) / this.tab.camera.zoom
          node.pos.y += (mousePos.y - this.tab.nodes.dragPos.y) / this.tab.camera.zoom
        }

        this.tab.nodes.dragPos = { ...mousePos }
      }



      // Panning

      if ((event.buttons & 4) === 4 && this.tab.camera.panPos != null) {
        this.tab.camera.pos.x -= (mousePos.x - this.tab.camera.panPos.x) / this.tab.camera.zoom
        this.tab.camera.pos.y -= (mousePos.y - this.tab.camera.panPos.y) / this.tab.camera.zoom
        
        this.tab.camera.panPos = { ...mousePos }
      }



      // Linking

      if ((event.buttons & 1) === 1 && this.tab.newLink != null) {
        let worldPos = _app.screenToWorld(this.tab, mousePos)

        if (typeof(this.tab.newLink.from) === 'number')
          this.tab.newLink.to = { ...worldPos }
        else
          this.tab.newLink.from = { ...worldPos }
      }
    },

    

    onMouseUp(event) {
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



      // Panning

      if (event.button === 1)
        this.tab.camera.panPos = null

        

      // Linking
      
      if (event.button === 0)
        this.tab.newLink = null
    },
    


    onMouseWheel(event) {
      if (event.deltaY > 0)
        this.tab.camera.zoom = Math.min(
          Math.pow(1.2, 12), this.tab.camera.zoom * 1.2)
      else
        this.tab.camera.zoom = Math.max(
          Math.pow(1 / 1.2, 12), this.tab.camera.zoom / 1.2)
    },



  },

  

}
</script>

<style>

</style>