<template>


  <v-snackbar :timeout="-1"
  v-model="$state.snackbar.active">

    {{ $state.snackbar.text }}

    <template v-slot:action="{ attrs }">

      <v-btn text v-bind="attrs"
      :color="$state.snackbar.color"
      @click="$state.snackbar.active = false">
        Close
      </v-btn>

    </template>

  </v-snackbar>


</template>

<script>
export default {
}
</script>

<style>

</style>