<template>

  <v-dialog max-width="300" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton tooltip="About" v-on="{ ...dialog }">
        <v-icon dense>mdi-information</v-icon>
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>About</v-card-title>
      
      <v-divider/>

      <v-card-text class="mt-4">
        <div>Visual SQL</div>
        <div>Developed by Kyota Langard</div>
        <div><a href="mail:kyota.langard@gmail.com">kyota.langard@gmail.com</a></div>
      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="primary" text
        @click="active = false">
          Close
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</template>

<script>
export default {


  data() {
    return {
      active: false,
    }
  },


}
</script>

<style>

</style>