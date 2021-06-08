<template>

  <div v-if="$state.nodeCreation.active && $state.nodeCreation.visible"
  style="position: absolute; width: 100vw; height: 100vh;
  pointer-events: none; overflow: hidden">
    <v-btn style="position: absolute; z-index: 999;
    min-width: 36px; transform: translate(-50%, -50%)" width="0"
    :style="{ left: `${$state.pointerPos.x}px`, top: `${$state.pointerPos.y}px` }">
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