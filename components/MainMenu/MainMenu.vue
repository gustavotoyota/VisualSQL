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



    <ToolbarButton tooltip="Settings">
      <v-icon dense>mdi-cog</v-icon>
    </ToolbarButton>



    <v-divider vertical inset class="mx-2"></v-divider>



    <ToolbarButton tooltip="Help">
      <v-icon dense>mdi-help-circle</v-icon>
    </ToolbarButton>



  </v-app-bar>
</template>

<script>
export default {

}
</script>

<style>

</style>