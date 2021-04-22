<template>
  <v-toolbar dense style="flex: none">



    <ToolbarButton tooltip="Cut" @click="$store.commit('cutSelectedNodes')">
      <v-icon dense>mdi-content-cut</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Copy" @click="$store.commit('copySelectedNodes')">
      <v-icon dense>mdi-content-copy</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Paste" @click="$store.commit('pasteNodes')">
      <v-icon dense>mdi-content-paste</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Delete" @click="$store.commit('deleteSelectedNodes')">
      <v-icon dense>mdi-delete</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <ToolbarButton tooltip="Undo" @click="$store.commit('undo')">
      <v-icon dense>mdi-undo</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Redo" @click="$store.commit('redo')">
      <v-icon dense>mdi-redo</v-icon>
    </ToolbarButton>
    


    <v-divider vertical inset class="mx-2"></v-divider>



    <v-btn depressed small>
      Generate SQL
    </v-btn>

  </v-toolbar>
</template>

<script>
export default {

}
</script>

<style>

</style>