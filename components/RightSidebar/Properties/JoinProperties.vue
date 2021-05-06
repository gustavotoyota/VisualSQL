<template>
  <div v-if="$app.nodeTypes[node.type].category === 'joins'">


    <div class="mx-5">


      <v-radio-group v-model="node.type">
        <template v-slot:label>
          <div>Join type:</div>
        </template>
        
        <v-radio label="Inner join" value="inner-join"></v-radio>
        <v-radio label="Left join" value="left-join"></v-radio>
        <v-radio label="Right join" value="right-join"></v-radio>
        <v-radio label="Full join" value="full-join"></v-radio>
        <v-radio label="Cross join" value="cross-join"></v-radio>
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

}
</script>

<style>

</style>