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

      style="margin-top: -5px"
      
      v-if="node.type !== 'cross-join'"

      label="Join condition (ON)"
      v-model="node.props.condition"

      :columns="$app.columnTracking.getInputColumns($getters.currentModule, node)"/>


    </div>
    

  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  methods: {

    isNodeTypeDisabled(nodeType) {
      return ($app.databases.data[$state.project.sql.database].
        infos.disabledNodeTypes || []).includes(nodeType)
    },

  },


}
</script>

<style>

</style>