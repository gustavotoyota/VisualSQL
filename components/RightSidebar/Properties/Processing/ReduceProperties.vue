<template>
  <div v-if="node.type === 'reduce'">


    <div class="mx-5 mt-4">
      <v-switch label="Limit:" hide-details
      v-model="node.props.limit.active">
      </v-switch>

      <v-text-field dense solo hide-details
      class="mt-2 body-2"
      :disabled="!node.props.limit.active"
      v-model="node.props.limit.value">
      </v-text-field>
      
      <div style="display: flex">
        <v-checkbox label="Percentage" hide-details
        :disabled="!node.props.limit.active"
        v-model="node.props.limit.percent">
        </v-checkbox>

        <v-spacer></v-spacer>

        <v-checkbox label="Include ties" hide-details
        :disabled="!node.props.limit.active"
        v-model="node.props.limit.withTies">
        </v-checkbox>
      </div>
    </div>


    <v-divider class="mt-6"></v-divider>


    <div class="mx-5 mt-4">
      <v-switch label="Offset:" hide-details
      v-model="node.props.offset.active">
      </v-switch>

      <v-text-field dense solo hide-details
      class="mt-2 body-2"
      :disabled="!node.props.offset.active"
      v-model="node.props.offset.value">
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