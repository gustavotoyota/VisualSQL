<template>
  <v-toolbar dense style="flex: none">



    <ToolbarButton tooltip="Cut" :disabled="emptyNodeSelection"
    @click="$store.commit('cutSelectedNodes')">
      <v-icon dense>mdi-content-cut</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Copy" :disabled="emptyNodeSelection"
    @click="$store.commit('copySelectedNodes')">
      <v-icon dense>mdi-content-copy</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Paste" :disabled="clipboard == null"
    @click="$store.commit('pasteNodes')">
      <v-icon dense>mdi-content-paste</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Delete" :disabled="emptySelection"
    @click="$store.commit('deleteSelection')">
      <v-icon dense>mdi-delete</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <ToolbarButton tooltip="Undo" :disabled="tab.currentStateIdx === 0"
    @click="$store.commit('undo')">
      <v-icon dense>mdi-undo</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Redo" :disabled="tab.currentStateIdx === tab.states.length - 1"
    @click="$store.commit('redo')">
      <v-icon dense>mdi-redo</v-icon>
    </ToolbarButton>
    


    <v-divider vertical inset class="mx-2"></v-divider>



    <v-btn depressed small text :disabled="emptyNodeSelection"
    @click="$app.treeGeneration.processNodes($store, module, $store.getters.activeNode)">
      Generate SQL
    </v-btn>

  </v-toolbar>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
  },

  

  computed: {

    ..._vuex.mapFields([
      'clipboard',
    ]),

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