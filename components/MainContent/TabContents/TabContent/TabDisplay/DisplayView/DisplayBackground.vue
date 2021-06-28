<template>
  <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 0"
  @pointerdown="onPointerDown">
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



      
      // Panning

      if (event.pointerType !== 'mouse') {
        $state.panning.active = true

        $state.panning.currentPos = $utils.shallowCopy(displayPos)
        

        
        $state.panning.startPos = $utils.shallowCopy(displayPos)

        $state.panning.selectTimeout = setTimeout(() => {
          if ($state.panning.selectTimeout == null)
            return



          $state.panning.active = false
          $state.panning.selectTimeout = null



          $state.selecting.active = true

          $state.selecting.startPos = $utils.shallowCopy(displayPos)
          $state.selecting.endPos = $utils.shallowCopy(displayPos)
        }, 300)
      }



      
      // Node deselection

      if (event.button === 0 && !event.ctrlKey)
        $commit('clearSelection')




      // Selecting

      if (event.pointerType === 'mouse' && event.button === 0) {
        $state.selecting.active = true

        $state.selecting.startPos = $utils.shallowCopy(displayPos)
        $state.selecting.endPos = $utils.shallowCopy(displayPos)
      }
    },


  },


}
</script>

<style>

</style>