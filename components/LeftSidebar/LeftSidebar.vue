<template>
  <v-navigation-drawer app width="300"
  v-if="leftSidebar" permanent clipped touchless>



    <ModulesWindow/>


    
    <TablesWindow/>



  </v-navigation-drawer>
</template>

<script>
export default {

  computed: {

    ..._vuex.mapFields({
      'leftSidebar': 'sidebars.left',
    }),

  },

}
</script>

<style>

</style>