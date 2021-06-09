<template>
  <div v-if="$state.selecting.active" class="selection"
  :style="{
    left: `${Math.min($state.selecting.startPos.x, $state.selecting.endPos.x)}px`,
    top: `${Math.min($state.selecting.startPos.y, $state.selecting.endPos.y)}px`,
    width: `${Math.abs($state.selecting.endPos.x - $state.selecting.startPos.x)}px`,
    height: `${Math.abs($state.selecting.endPos.y - $state.selecting.startPos.y)}px`,
  }">
  </div>
</template>

<script>
export default {

  props: {
    tab: Object,
  },

}
</script>

<style scoped>
.selection {
  position: absolute;

  border: 1px solid rgba(66, 165, 245, 0.8);

  background-color: rgba(33, 150, 243, 0.4);

  pointer-events: none;
}
</style>