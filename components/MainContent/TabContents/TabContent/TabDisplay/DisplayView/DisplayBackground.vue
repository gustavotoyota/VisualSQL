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
      if (!event.isPrimary) {
        this.$state.panning.selectTimeout = null
        return
      }




      let displayPos = _app.getDisplayPos(event)



      
      // Panning

      if (event.pointerType !== 'mouse') {
        this.$state.panning.active = true

        this.$state.panning.currentPos = { ...displayPos }
        

        
        this.$state.panning.startPos = { ...displayPos }

        this.$state.panning.selectTimeout = setTimeout(() => {
          if (this.$state.panning.selectTimeout == null)
            return



          this.$state.panning.active = false
          this.$state.panning.selectTimeout = null



          this.$state.selecting.active = true

          this.$state.selecting.startPos = { ...displayPos }
          this.$state.selecting.endPos = { ...displayPos }
        }, 300)
      }



      
      // Node deselection

      if (event.button === 0 && !event.ctrlKey)
        this.$store.commit('clearSelection')




      // Selecting

      if (event.pointerType === 'mouse' && event.button === 0) {
        this.$state.selecting.active = true

        this.$state.selecting.startPos = { ...displayPos }
        this.$state.selecting.endPos = { ...displayPos }
      }
    },


  },


}
</script>

<style>

</style>