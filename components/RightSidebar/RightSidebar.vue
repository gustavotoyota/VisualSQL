<template>
  <v-navigation-drawer app width="300" right
  v-if="rightSidebar" permanent clipped touchless>



    <!-- Properties header -->

    <v-toolbar dense style="flex: none">
      <v-toolbar-title>
        <v-icon>mdi-chart-box</v-icon>
        <span style="position: relative; top: 2px">Properties</span>
      </v-toolbar-title>
    </v-toolbar>




    <!-- Properties content -->

    <div class="pa-5"
    style="flex: 1; height: 0; overflow-y: auto">

      <Properties>
      </Properties>

    </div>




  </v-navigation-drawer>
</template>

<script>
export default {

  computed: {
    
    ..._vuex.mapFields({
      'rightSidebar': 'sidebars.right',
    }),

  },

}
</script>

<style>

</style>