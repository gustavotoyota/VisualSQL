<template>
  <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 0"

  @pointerdown.capture="onPointerDown"
  @pointerup="onPointerUp"
  
  @wheel="onMouseWheel">

    <DisplayBackground :tab="tab" :module="module"/>

    <DisplayLinks :tab="tab" :module="module"/>

    <DisplayNodes :tab="tab" :module="module"/>

    <DisplaySelection :tab="tab"/>

  </div>
</template>

<script>
export default {


  props: {
    tab: Object,
    module: Object,
  },




  methods: {



    onPointerDown(event) {
      let displayPos = _app.getDisplayPos(event)

      this.$set(this.$state.pinching.pointers, event.pointerId, displayPos)

      if (Object.keys(this.$state.pinching.pointers).length >= 2)
        event.stopPropagation()




      // Panning

      if (event.button === 1) {
        this.$state.panning.active = true

        this.$state.panning.currentPos = { ...displayPos }
      }
    },



    onPointerUp(event) {
      if (this.$state.nodeCreation.active && this.$state.nodeCreation.visible) {
        let displayPos = _app.getDisplayPos(event)
        let worldPos = _app.screenToWorld(this.tab, displayPos)
        
        this.$store.commit('createNode', {
          moduleId: this.tab.moduleId,

          node: {
            type: this.$state.nodeCreation.nodeType,

            pos: {
              x: worldPos.x,
              y: worldPos.y,
            },
          },
        })
      }
    },


    
    
    onMouseWheel(event) {
      // Calculate world position

      let displayPos = _app.getDisplayPos(event)
      let worldPos = _app.screenToWorld(this.tab, displayPos)




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