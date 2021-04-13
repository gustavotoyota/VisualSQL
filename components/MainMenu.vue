<template>
  <v-app-bar app clipped-left clipped-right dense>

    <v-app-bar-title>
      Visual SQL Tool
    </v-app-bar-title>

    <v-divider vertical inset class="ml-4 mr-2"></v-divider>

    <v-btn depressed small style="min-width: 28px" width="0">
      <v-icon dense>mdi-file</v-icon>
    </v-btn>
    <v-btn depressed small style="min-width: 28px" width="0">
      <v-icon dense>mdi-folder-open</v-icon>
    </v-btn>
    <v-btn depressed small style="min-width: 28px" width="0">
      <v-icon dense>mdi-content-save</v-icon>
    </v-btn>

    <v-divider vertical inset class="mx-2"></v-divider>

    <v-btn depressed small style="min-width: 28px" width="0">
      <v-icon dense>mdi-cog</v-icon>
    </v-btn>

    <v-divider vertical inset class="mx-2"></v-divider>

    <v-btn depressed small style="min-width: 28px" width="0">
      <v-icon dense>mdi-help-circle</v-icon>
    </v-btn>



    <v-spacer></v-spacer>

  </v-app-bar>
</template>

<script>
export default {

}
</script>

<style>

</style>