<template>
  <v-toolbar dense style="flex: none">



    <ToolbarButton tooltip="Cut" :disabled="emptyNodeSelection"
    @click="$commit('cutSelection')">
      <v-icon dense>mdi-content-cut</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Copy" :disabled="emptyNodeSelection"
    @click="$commit('copySelection')">
      <v-icon dense>mdi-content-copy</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Paste"
    @click="$commit('paste')">
      <v-icon dense>mdi-content-paste</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"/>

    

    <ToolbarButton tooltip="Delete" :disabled="emptySelection"
    @click="$commit('deleteSelection')">
      <v-icon dense>mdi-delete</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"/>



    <ToolbarButton tooltip="Undo" :disabled="tab.states.currentIdx === 0"
    @click="$commit('undo')">
      <v-icon dense>mdi-undo</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Redo" :disabled="tab.states.currentIdx === tab.states.list.length - 1"
    @click="$commit('redo')">
      <v-icon dense>mdi-redo</v-icon>
    </ToolbarButton>
    


    <v-divider vertical inset class="mx-2"/>



    <GenerateSQL :module="module" :tab="tab"
    :disabled="emptyNodeSelection"/>


  </v-toolbar>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
  },


  computed: {

    emptyNodeSelection() {
      return Object.keys(this.tab.nodes.selected).length === 0
    },

    emptySelection() {
      return this.emptyNodeSelection &&
        Object.keys(this.tab.links.selected).length === 0
    },

  },


}
</script>

<style>

</style>