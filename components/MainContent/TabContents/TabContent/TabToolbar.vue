<template>
  <v-toolbar dense style="flex: none">



    <ToolbarButton tooltip="Cut">
      <v-icon dense>mdi-content-cut</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Copy">
      <v-icon dense>mdi-content-copy</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Paste">
      <v-icon dense>mdi-content-paste</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Delete" @click="$store.commit('deleteSelectedNodes')">
      <v-icon dense>mdi-delete</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <ToolbarButton tooltip="Undo">
      <v-icon dense>mdi-undo</v-icon>
    </ToolbarButton>

    <ToolbarButton tooltip="Redo">
      <v-icon dense>mdi-redo</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <ToolbarButton tooltip="Duplicate">
      <v-icon dense>mdi-content-duplicate</v-icon>
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