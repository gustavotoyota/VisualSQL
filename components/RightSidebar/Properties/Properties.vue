<template>
  <div v-if="$getters.activeNode != null" class="mb-6">

    <div class="mx-5 mt-4 font-weight-medium">
      {{ $app.nodeTypes[$getters.activeNode.type].title }} node
    </div>




    <v-divider class="mt-3"/>




    <div class="mx-5 mt-5">
      
      <v-tooltip top open-delay="250">

        <template v-slot:activator="{ on, attrs }">

          <div v-on="on" v-bind="attrs"
          style="display: inline-block; float: right">

            <v-checkbox hide-details label="Common"
            v-model="$getters.activeNode.props.common"
            :disabled="$getters.activeNode.props.name === ''"
            style="margin-top: -7px; position: relative; z-index: 9999"/>

          </div>

        </template>

        <div style="white-space: nowrap">
          <div>If checked, the SQL</div>
          <div>of this node will be</div>
          <div>generated as CTE</div>
        </div>

      </v-tooltip>


      <div class="body-2 grey--text text--lighten-1">
        Node name:
      </div>

      <v-text-field dense solo hide-details style="clear: right"
      class="mt-1 body-2" v-model="$getters.activeNode.props.name">
      </v-text-field>
    </div>
    

    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Node description:
      </div>

      <v-textarea dense solo hide-details class="mt-1 body-2"
      no-resize rows="2" v-model="$getters.activeNode.props.description">
      </v-textarea>
    </div>




    <v-divider class="mt-6"/>




    <TableProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <NodeProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <SQLProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    
    <SetOperationProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <JoinProperties :module="$getters.currentModule" :node="$getters.activeNode"/>

    <FilterProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <TransformProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <DistinctProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <SortProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    <LimitProperties :module="$getters.currentModule" :node="$getters.activeNode"/>
    
    
  </div>



  <div v-else-if="$getters.activeLink != null">

    <div class="mx-5 mt-4 font-weight-medium">
      Link
    </div>




    <v-divider class="mt-3"/>




    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Link alias:
      </div>

      <v-text-field dense solo hide-details
      class="mt-1 body-2" v-model="$getters.activeLink.props.alias">
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

    activeObject() {
      return $getters.activeNode ?? $getters.activeLink
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
          $commit('saveState')
          return
        }

        $commit('replaceState')
      },

      deep: true,
    },

  },

}
</script>

<style>

</style>