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



      <div v-if="node.type !== 'cross-join'">

        <div class="body-2 grey--text text--lighten-1">
          Join condition:
        </div>

        <CodeEditor class="mt-1" style="height: 100px"
        v-model="node.props.condition"/>

      </div>
      
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