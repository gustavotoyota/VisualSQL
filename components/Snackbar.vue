<template>


  <v-snackbar v-model="$state.snackbar.active">

    {{ $state.snackbar.text }}

    <template v-slot:action="{ attrs }">

      <v-btn color="red" text v-bind="attrs"
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