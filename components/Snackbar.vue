<template>


  <v-snackbar v-model="snackbar.active">
    {{ snackbar.text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="red" text v-bind="attrs"
      @click="snackbar.active = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>


</template>

<script>
export default {

  computed: {

    ..._vuex.mapFields([
      'snackbar',
    ]),

  },

}
</script>

<style>

</style>