<template>
  <div style="position: absolute; left: 0; top: 0">



    <!-- Input sockets -->

    <NodeSocket v-if="node.incomingLinks.length > 0"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: node.incomingLinks.length == 1 ? '0px' : `${-$app.socketOffset.y}px` }"
    @pointerdown="inputPointerDown(0, $event)"
    @pointerup="inputPointerUp(0, $event)">
    </NodeSocket>

    <NodeSocket v-if="node.incomingLinks.length > 1"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: `${$app.socketOffset.y}px` }"
    @pointerdown="inputPointerDown(1, $event)"
    @pointerup="inputPointerUp(1, $event)">
    </NodeSocket>
    



    <!-- Output sockets -->
    
    <NodeSocket v-if="node.outgoingLinks != null" style="left: 34px"
    @pointerdown="outputPointerDown" @pointerup="outputPointerUp">
    </NodeSocket>



  </div>
</template>

<script>
export default {


  props: {
    tab: Object,
    node: Object,
  },


  methods: {

    inputPointerDown(socket, event) {
    },
    inputPointerUp(socket, event) {
    },


    outputPointerDown(event) {
    },
    outputPointerUp(event) {
    },
    
  },

  
}
</script>

<style>

</style>