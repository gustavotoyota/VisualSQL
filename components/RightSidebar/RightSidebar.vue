<template>
  <v-navigation-drawer app width="300" right
  v-if="$state.sidebars.right" permanent clipped touchless
  style="top: 48px">



    <!-- Properties header -->

    <v-toolbar dense style="flex: none">
      <v-toolbar-title>
        <v-icon>mdi-chart-box</v-icon>
        <span style="position: relative; top: 2px">Properties</span>
      </v-toolbar-title>
    </v-toolbar>




    <!-- Properties content -->

    <div style="flex: 1; height: 0; overflow-y: auto">

      <Properties/>

    </div>




  </v-navigation-drawer>
</template>

<script>
export default {
}
</script>

<style>

</style>