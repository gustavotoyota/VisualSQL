<template>
  <div v-if="$app.nodeTypes[node.type].category === 'set-operations'">


    <div class="mx-5">
      <v-radio-group v-model="node.type" hide-details>
        <template v-slot:label>
          <div>Set operation:</div>
        </template>
        
        <v-radio label="Union" value="union" :disabled="isNodeTypeDisabled('union')"/>
        <v-radio label="Difference" value="difference" :disabled="isNodeTypeDisabled('difference')"/>
        <v-radio label="Intersection" value="intersection" :disabled="isNodeTypeDisabled('intersection')"/>
      </v-radio-group>
    </div>


    <div v-if="node.type === 'union'">
      <v-divider class="mt-6"/>


      <div class="mx-5 mt-5">
        <v-checkbox label="Allow duplicate rows"
        v-model="node.props.allowDuplicates">
        </v-checkbox>
      </div>
    </div>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  computed: {

    database() {
      return _app.databases[this.$state.project.sql.database]
    },

  },



  methods: {

    isNodeTypeDisabled(nodeType) {
      return this.database.infos.disabledNodeTypes.includes(nodeType)
    },

  },

}
</script>

<style>

</style>