<template>
  <div v-if="node.type === 'limit'">


    <div class="mx-5 mt-4">
      <div class="body-2 grey--text text--lighten-1">
        Limit:
      </div>

      <v-text-field dense solo hide-details
      class="mt-2 body-2" type="number"
      v-model="node.props.limit.value">
      </v-text-field>
    </div>


    <div class="mx-5 mt-4">
      <div class="body-2 grey--text text--lighten-1">
        Offset:
      </div>

      <v-text-field dense solo hide-details
      class="mt-2 body-2" type="number"
      v-model="node.props.offset">
      </v-text-field>
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