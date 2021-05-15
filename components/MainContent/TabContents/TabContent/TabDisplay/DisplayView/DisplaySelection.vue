<template>
  <div v-if="tab.selection.start != null" class="selection"
  :style="{
    left: `${Math.min(tab.selection.start.x, tab.selection.end.x)}px`,
    top: `${Math.min(tab.selection.start.y, tab.selection.end.y)}px`,
    width: `${Math.abs(tab.selection.end.x - tab.selection.start.x)}px`,
    height: `${Math.abs(tab.selection.end.y - tab.selection.start.y)}px`,
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