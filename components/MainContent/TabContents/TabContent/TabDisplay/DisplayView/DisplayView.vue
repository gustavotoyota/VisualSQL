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
      let displayPos = $getters.getDisplayPos(event)

      $set($state.pinching.pointers, event.pointerId, displayPos)

      if (Object.keys($state.pinching.pointers).length >= 2) {
        $state.panning.selectTimeout = null
        $state.selecting.active = false

        event.stopPropagation()
      }




      // Panning

      if (event.button === 1) {
        $state.panning.active = true

        $state.panning.currentPos = $utils.shallowCopy(displayPos)
      }
    },



    onPointerUp(event) {
      if ($state.nodeCreation.active && $state.nodeCreation.visible) {
        let displayPos = $getters.getDisplayPos(event)
        let worldPos = $getters.screenToWorld(this.module, displayPos)
        
        $commit('createNode', {
          moduleId: this.tab.moduleId,

          node: {
            type: $state.nodeCreation.nodeType,

            pos: {
              x: worldPos.x,
              y: worldPos.y,
            },

            props: $state.nodeCreation.props,
          },
        })
      }
    },


    
    
    onMouseWheel(event) {
      // Calculate world position

      let displayPos = $getters.getDisplayPos(event)
      let worldPos = $getters.screenToWorld(this.module, displayPos)




      // Update camera zoom

      let multiplier = event.deltaY > 0 ? (1 / 1.2) : 1.2

      let oldZoom = this.module.camera.zoom

      this.module.camera.zoom = Math.min(Math.max(
        this.module.camera.zoom * multiplier, $app.minZoom), $app.maxZoom)




      // Update camera position

      let ratio = this.module.camera.zoom / oldZoom

      this.module.camera.pos = {
        x: worldPos.x + (this.module.camera.pos.x - worldPos.x) / ratio,
        y: worldPos.y + (this.module.camera.pos.y - worldPos.y) / ratio,
      }
    },
    

  },



}
</script>

<style>

</style>