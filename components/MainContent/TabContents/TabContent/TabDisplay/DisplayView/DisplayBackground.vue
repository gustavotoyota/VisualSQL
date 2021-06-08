<template>
  <div style="position: absolute; inset: 0"
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




      let pointerPos = _app.getPointerPos(event)



      
      // Panning

      if (event.button === 1)
        this.$state.panning.currentPos = { ...pointerPos }
      
      if (event.pointerType !== 'mouse') {
        this.$state.panning.currentPos = { ...pointerPos }

        this.$state.panning.startPos = { ...pointerPos }
        this.$state.panning.selectTimeout = setTimeout(() => {
          if (this.$state.panning.selectTimeout == null)
            return

          this.$state.panning.currentPos = null
          this.$state.panning.selectTimeout = null

          this.$state.selecting.startPos = { ...pointerPos }
          this.$state.selecting.endPos = { ...pointerPos }
        }, 300)
      }



      
      // Node deselection

      if (event.button === 0 && !event.ctrlKey)
        this.$store.commit('clearSelection')




      // Selecting

      if (event.pointerType === 'mouse' && event.button === 0) {
        this.$state.selecting.startPos = { ...pointerPos }
        this.$state.selecting.endPos = { ...pointerPos }
      }
    },


  },


}
</script>

<style>

</style>