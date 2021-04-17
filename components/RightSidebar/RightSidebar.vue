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
    style="flex: 1; height: 0; overflow-y: scroll">

      <div v-if="activeNode != null">


        <div>
          <div class="mb-1 body-2 grey--text text--lighten-1">Node name:</div>
          <v-text-field dense solo hide-details
          class="body-2" v-model="activeNode.name">
          </v-text-field>
        </div>
        

        <div class="mt-4">
          <div class="mb-1 body-2 grey--text text--lighten-1">Node description:</div>
          <v-textarea dense solo hide-details class="body-2"
          no-resize rows="2" v-model="activeNode.description">
          </v-textarea>
        </div>



        <v-divider class="mt-5">
        </v-divider>



        <TableProperties :node="activeNode"></TableProperties>
        <ModuleProperties :node="activeNode"></ModuleProperties>
        <NodeProperties :node="activeNode"></NodeProperties>
        <SQLProperties :node="activeNode"></SQLProperties>
        
        <SetOperationProperties :node="activeNode"></SetOperationProperties>
        <JoinProperties :node="activeNode"></JoinProperties>

        <FilterProperties :node="activeNode"></FilterProperties>
        <TransformProperties :node="activeNode"></TransformProperties>
        <DistinctProperties :node="activeNode"></DistinctProperties>
        <SortProperties :node="activeNode"></SortProperties>
        <ReduceProperties :node="activeNode"></ReduceProperties>
        
        <PivotProperties :node="activeNode"></PivotProperties>
        
        
      </div>

    </div>




  </v-navigation-drawer>
</template>

<script>
export default {

  computed: {
    
    ..._vuex.mapFields({
      'rightSidebar': 'sidebars.right',
    }),

    ..._vuex.mapGetters([
      'activeNode',
    ]),

  },

}
</script>

<style>

</style>