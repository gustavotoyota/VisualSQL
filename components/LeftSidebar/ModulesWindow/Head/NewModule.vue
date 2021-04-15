<template>
  <v-dialog max-width="280" eager
  v-model="active">


    <template v-slot:activator="{ on: dialog }">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn depressed rounded class="mt-1" width="0" height="32"
          style="position: relative; left: 8px; min-width: 32px"
          v-on="{ ...dialog, ...tooltip }">
            <v-icon dense>mdi-plus-thick</v-icon>
          </v-btn>

        </template>

        <span>New module</span>

      </v-tooltip>

    </template>



    <v-form ref="form" @submit.prevent="active = false;
    $store.commit('createModule', name)">
    
      <v-card>

        <v-card-title>
          New module
        </v-card-title>

        <v-card-text>

          <v-text-field label="Module name"
          autofocus v-model="name">
          </v-text-field>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn color="primary" text type="submit">
            Ok
          </v-btn>

          <v-btn color="primary" text @click="active = false">
            Cancel
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-form>



  </v-dialog>
</template>

<script>
export default {


  data() {
    return {
      active: false,
      
      name: '',
    }
  },


  watch: {

    active(value) {
      if (value)
        this.$refs.form.reset()
    },

  },


}
</script>

<style>

</style>