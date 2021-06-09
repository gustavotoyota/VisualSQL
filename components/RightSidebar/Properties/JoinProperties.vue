<template>
  <div v-if="$app.nodeTypes[node.type].category === 'joins'">


    <div class="mx-5">


      <v-radio-group v-model="node.type">
        <template v-slot:label>
          <div>Join type:</div>
        </template>
        
        <v-radio label="Inner join" value="inner-join" :disabled="isNodeTypeDisabled('inner-join')"/>
        <v-radio label="Left join" value="left-join" :disabled="isNodeTypeDisabled('left-join')"/>
        <v-radio label="Right join" value="right-join" :disabled="isNodeTypeDisabled('right-join')"/>
        <v-radio label="Full join" value="full-join" :disabled="isNodeTypeDisabled('full-join')"/>
        <v-radio label="Cross join" value="cross-join" :disabled="isNodeTypeDisabled('cross-join')"/>
      </v-radio-group>



      <PropCodeEditor
      
      v-if="node.type !== 'cross-join'"

      label="Join condition:"
      v-model="node.props.condition"/>


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
      return _app.databases.data[this.$state.project.sql.database]
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