<template>

  <div v-if="$state.nodeCreation.active && $state.nodeCreation.visible"
  style="position: absolute; left: 0; top: 0; pointer-events: none">
    <v-btn style="position: absolute; z-index: 999;
    min-width: 36px; transform: translate(-50%, -50%)" width="0"
    :style="{ left: `${$state.pointer.pagePos.x}px`, top: `${$state.pointer.pagePos.y}px` }">
      <NodeIcon :type="$state.nodeCreation.nodeType"></NodeIcon>
    </v-btn>
  </div>

</template>

<script>
export default {
}
</script>

<style>

</style>