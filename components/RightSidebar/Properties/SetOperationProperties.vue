<template>
  <div v-if="$app.nodeTypes[node.type].category === 'set-operations'">


    <div class="mx-5">
      <v-radio-group v-model="node.type" hide-details>
        <template v-slot:label>
          <div>Set operation:</div>
        </template>
        
        <v-radio label="Union" value="union"></v-radio>
        <v-radio label="Difference" value="difference"></v-radio>
        <v-radio label="Intersection" value="intersection"></v-radio>
      </v-radio-group>
    </div>


    <div v-if="node.type === 'union'">
      <v-divider class="mt-6"></v-divider>


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

}
</script>

<style>

</style>