<template>
  <div @mousedown="onMouseDown"
  @wheel="onMouseWheel"
  style="position: relative; width: 100%; height: 100%; overflow: hidden">
  
  

    <!-- Centralizer -->

    <div style="position: absolute; left: 50%; top: 50%">



      <!-- Viewbox -->

      <div style="width: 0; height: 0"
      :style="{ transform: 'scale(' + tab.camera.zoom +') ' +
      'translate(' + -tab.camera.pos.x + 'px, ' + -tab.camera.pos.y + 'px)' }">

        <ModuleNode @mousedown="onNodeMouseDown"
        v-for="node in module.nodes" :key="node.id"
        :node="node" :selected="selectedNodes[node.id]">
        </ModuleNode>

      </div>



    </div>



  </div>
</template>

<script>
export default {


  props: {
    tab: { type: Object },
    module: { type: Object },
  },




  data() {
    return {

      selectedNodes: {}

    }
  },




  mounted() {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },



  methods: {


    onMouseDown(event) {
      if (!event.ctrlKey) {
        this.activeNode = null

        this.selectedNodes = []
      }

      this.tab.camera.panning = true

      this.tab.camera.panPos.x = event.clientX
      this.tab.camera.panPos.y = event.clientY
    },

    
    onMouseMove(event) {
      if (this.tab.camera.panning && (event.buttons & 4) === 4) {
        this.tab.camera.pos.x -= (event.clientX - this.tab.camera.panPos.x) / this.tab.camera.zoom
        this.tab.camera.pos.y -= (event.clientY - this.tab.camera.panPos.y) / this.tab.camera.zoom
        
        this.tab.camera.panPos.x = event.clientX
        this.tab.camera.panPos.y = event.clientY
      }
    },

    
    onMouseUp(event) {
      this.tab.camera.panning = false
    },
    

    onMouseWheel(event) {
      if (event.deltaY > 0)
        this.tab.camera.zoom = Math.min(
          Math.pow(1.2, 12), this.tab.camera.zoom * 1.2)
      else
        this.tab.camera.zoom = Math.max(
          Math.pow(1 / 1.2, 12), this.tab.camera.zoom / 1.2)
    },



    onNodeMouseDown(node, event) {
      this.selectedNodes = []

      this.$set(this.selectedNodes, node.id, true)
    },


  },


}
</script>

<style>

</style>