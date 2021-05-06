<template>
  <v-app-bar app clipped-left clipped-right dense>



    <v-app-bar-title>
      Visual SQL Tool
    </v-app-bar-title>



    <v-divider vertical inset class="ml-4 mr-2"></v-divider>



    <NewProject>
    </NewProject>
    
    <ToolbarButton tooltip="Open project">
      <v-icon dense>mdi-folder-open</v-icon>
    </ToolbarButton>
    
    <ToolbarButton tooltip="Save project">
      <v-icon dense>mdi-content-save</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <ToolbarButton tooltip="Help">
      <v-icon dense>mdi-help-circle</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <v-select dense outlined height="30" class="ml-1"
    style="font-size: 14px; flex: none; width: 160px"
    hide-details background-color="#101010"
    :menu-props="{ top: false, offsetY: true }"

    :items="$app.databases" item-text="text" item-value="value"

    v-model="$store.state.project.sql.database"/>



  </v-app-bar>
</template>

<script>
export default {

}
</script>

<style scoped>
.v-select /deep/ .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>