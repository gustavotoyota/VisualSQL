<template>
  <div v-if="tab.nodes.selectionStart != null"
  :style="{
    left: `${Math.min(tab.nodes.selectionStart.x, tab.nodes.selectionEnd.x)}px`,
    top: `${Math.min(tab.nodes.selectionStart.y, tab.nodes.selectionEnd.y)}px`,
    width: `${Math.abs(tab.nodes.selectionEnd.x - tab.nodes.selectionStart.x)}px`,
    height: `${Math.abs(tab.nodes.selectionEnd.y - tab.nodes.selectionStart.y)}px`,
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