<template>

  <div v-if="nodeCreation.active"
  style="position: absolute; width: 100vw; height: 100vh;
  pointer-events: none; overflow: hidden">
    <v-btn style="position: absolute; z-index: 999;
    min-width: 36px; transform: translate(-50%, -50%)" width="0"
    :style="{ left: `${pointerPos.x}px`, top: `${pointerPos.y}px` }">
      <NodeIcon :type="nodeCreation.nodeType"></NodeIcon>
    </v-btn>
  </div>

</template>

<script>
export default {



  computed: {

    ..._vuex.mapFields([
      'pointerPos',
      'nodeCreation',
    ]),

  },



}
</script>

<style>

</style>