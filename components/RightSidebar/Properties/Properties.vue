<template>
  <div v-if="activeNode != null" class="mb-6">

    <div class="mx-5 mt-4 font-weight-medium">
      {{ $app.nodeTypes[activeNode.type].title }} node
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




    <TableProperties :node="activeNode"/>
    <NodeProperties :node="activeNode"/>
    <SQLProperties :node="activeNode"/>
    
    <SetOperationProperties :node="activeNode"/>
    <JoinProperties :node="activeNode"/>

    <FilterProperties :node="activeNode"/>
    <TransformProperties :node="activeNode"/>
    <DistinctProperties :node="activeNode"/>
    <SortProperties :node="activeNode"/>
    <LimitProperties :node="activeNode"/>
    
    
  </div>



  <div v-else-if="activeLink != null">

    <div class="mx-5 mt-4 font-weight-medium">
      Link
    </div>




    <v-divider class="mt-3">
    </v-divider>




    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Link alias:
      </div>

      <v-text-field dense solo hide-details
      class="mt-1 body-2" v-model="activeLink.props.alias">
      </v-text-field>
    </div>

  </div>



  <div v-else>

    <div class="mx-5 mt-4">
      No currently active object
    </div>

  </div>


</template>

<script>
let lastActiveObject = null
let firstChange = false

export default {
  
  computed: {

    ..._vuex.mapGetters([
      'activeNode',
      'activeLink',
    ]),

    activeObject() {
      return this.activeNode ?? this.activeLink
    },
    
  },

  watch: {
    
    'activeObject.props': {
      handler: function () {
        if (this.activeObject !== lastActiveObject) {
          firstChange = true
          lastActiveObject = this.activeObject
          return
        }

        if (this.activeObject == null)
          return

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