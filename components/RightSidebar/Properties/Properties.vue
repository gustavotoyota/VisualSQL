<template>
  <div v-if="activeNode == null">

    <div class="mx-5 mt-4">
      No currently active node
    </div>

  </div>


  <div v-else class="mb-6">

    <div class="mx-5 mt-4 font-weight-medium">
      {{ $app.nodeTypes[activeNode.type].description }} node
    </div>




    <v-divider class="mt-3">
    </v-divider>




    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Node name:
      </div>

      <v-text-field dense solo hide-details
      class="mt-1 body-2" v-model="activeNode.props.name">
      </v-text-field>
    </div>
    

    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Node description:
      </div>

      <v-textarea dense solo hide-details class="mt-1 body-2"
      no-resize rows="2" v-model="activeNode.props.description">
      </v-textarea>
    </div>




    <v-divider class="mt-6" v-if="activeNode.type !== 'output'">
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
</template>

<script>
let ignoreWatch = false
let firstChange = false

export default {
  
  computed: {

    ..._vuex.mapGetters([
      'activeNode',
    ]),
    
  },

  watch: {

    activeNode: function () {
      ignoreWatch = true
    },

    'activeNode.props': {
      handler: function () {
        if (ignoreWatch) {
          ignoreWatch = false
          firstChange = true
          return
        }

        if (firstChange) {
          firstChange = false
          this.$store.commit('saveState')
          return
        }

        this.$store.commit('replaceState')
      },

      deep: true,
    },

  },

}
</script>

<style>

</style>