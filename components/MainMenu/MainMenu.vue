<template>
  <v-app-bar app clipped-left clipped-right dense
  style="height: 50px; padding-top: 1px; padding-right: 0">



    <v-app-bar-title>
      Visual SQL
    </v-app-bar-title>



    <v-divider vertical inset class="ml-4 mr-2"/>



    <NewProject/>
    
    <OpenProject/>
    
    <SaveProject/>



    <v-divider vertical inset class="mx-2"/>



    <ToolbarButton tooltip="Help" btn-style="display: none">
      <v-icon dense>mdi-help-circle</v-icon>
    </ToolbarButton>



    <v-select dense outlined height="30" class="mx-1"
    style="font-size: 14px; flex: none; width: 160px"
    hide-details background-color="#101010"
    :menu-props="{ top: false, offsetY: true }"

    :items="$app.databases.items" item-text="text" item-value="value"

    v-model="$state.project.sql.database"/>



    <v-divider vertical inset class="mx-2"/>


    
    <ToolbarButton btn-style="width: auto">
      Help
    </ToolbarButton>

    <About/>



    <v-spacer/>



    <div style="margin-left: 8px; width: 300px; height: 50px">

      <!--
      <adsbygoogle

      :ad-style="{
        display: 'inline-block',

        width: '300px',
        height: '50px',
      }"

      ad-client="ca-pub-7390527632812452"
      ad-slot="9297057205"
      
      ad-format="rectangular"
      data-full-width-responsive="false"/>
      -->

    </div>



  </v-app-bar>
</template>

<script>
export default {

}
</script>

<style scoped>
.v-app-bar /deep/ .v-toolbar__content {
  padding-right: 0;
}

.v-app-bar-title /deep/ .v-app-bar-title__content {
  visibility: hidden;
}

.v-select /deep/ .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>