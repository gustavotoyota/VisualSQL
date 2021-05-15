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

            this.tab.selection.start = { ...pointerPos }
            this.tab.selection.end = { ...pointerPos }
          }, 300)
        }
      }



      
      // Node deselection

      if (event.button === 0 && !event.ctrlKey)
        this.$store.commit('clearSelection')




      // Selecting

      if (event.pointerType === 'mouse' && event.button === 0) {
        this.tab.selection.start = { ...pointerPos }
        this.tab.selection.end = { ...pointerPos }
      }
    },


  },


}
</script>

<style>

</style>