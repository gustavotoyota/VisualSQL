<template>
  <div style="position: absolute; left: 0; top: 0">


    <NodeSocket v-if="numInputs > 0"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: numInputs == 1 ? '0px' : `${-$app.socketOffset.y}px` }">
    </NodeSocket>
    <NodeSocket v-if="numInputs > 1"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: `${$app.socketOffset.y}px` }">
    </NodeSocket>
    

    
    <NodeSocket v-if="hasOutput" style="left: 34px">
    </NodeSocket>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },


  computed: {
    nodeGroupData() {
      return _app.nodeGroups[_app.nodeTypes[this.node.type].group]
    },
    numInputs() {
      return this.nodeGroupData.numInputs
    },
    hasOutput() {
      return this.nodeGroupData.hasOutput
    }
  },

  
}
</script>

<style>

</style>