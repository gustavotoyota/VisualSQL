<template>
  <div v-if="tab.nodes.selection.start != null"
  :style="{
    left: `${Math.min(tab.nodes.selection.start.x, tab.nodes.selection.end.x)}px`,
    top: `${Math.min(tab.nodes.selection.start.y, tab.nodes.selection.end.y)}px`,
    width: `${Math.abs(tab.nodes.selection.end.x - tab.nodes.selection.start.x)}px`,
    height: `${Math.abs(tab.nodes.selection.end.y - tab.nodes.selection.start.y)}px`,
  }" class="selection">
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