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



    <v-select dense outlined height="30" class="mx-1"
    style="font-size: 14px; flex: none; width: 160px"
    hide-details background-color="#101010"
    :menu-props="{ top: false, offsetY: true }"

    :items="$app.databases.items" item-text="text" item-value="value"

    v-model="$state.project.sql.database"/>



    <v-divider vertical inset class="mx-2"/>

  

    <About/>



    <v-spacer/>



    <!--
    <div style="margin-left: 12px; width: 300px; height: 50px;
    background-color: black; display: flex; color: white; font-size: 14px;
    justify-content: center; align-items: center">
      Ad
    </div>
    -->



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