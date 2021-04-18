<template>
  <div v-if="node.type === 'reduce'" class="mt-4">

    <div class="mt-4">
      <div class="mb-1 body-2 grey--text text--lighten-1">
        Offset:
      </div>

      <v-text-field dense solo hide-details type="number"
      class="body-2" v-model="node.props.offset">
      </v-text-field>
    </div>


    <div class="mt-4">
      <div class="mb-1 body-2 grey--text text--lighten-1">
        Limit:
      </div>

      <v-text-field dense solo hide-details type="number"
      class="body-2" v-model="node.props.limit">
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