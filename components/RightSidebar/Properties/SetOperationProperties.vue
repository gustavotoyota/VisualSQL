<template>
  <div v-if="$app.nodeTypes[node.type].category === 'set-operations'">


    <div class="mx-5">
      <v-radio-group v-model="node.type">
        <template v-slot:label>
          <div>Set operation:</div>
        </template>
        
        <v-radio label="Union all" value="union-all"></v-radio>
        <v-radio label="Union" value="union"></v-radio>
        <v-radio label="Except" value="except"></v-radio>
        <v-radio label="Intersect" value="intersect"></v-radio>
      </v-radio-group>
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