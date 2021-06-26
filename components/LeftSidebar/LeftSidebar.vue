<template>
  <v-navigation-drawer
  v-if="$state.sidebars.left"
  app width="300"
  permanent clipped touchless
  style="top: 60px">



    <ModulesWindow/>


    
    <TablesWindow/>



  </v-navigation-drawer>
</template>

<script>
export default {
}
</script>

<style>

</style>