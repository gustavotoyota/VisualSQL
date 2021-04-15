<template>
  <v-dialog max-width="250" v-model="active">


    <template v-slot:activator="{ on, attrs }">

      <v-btn small rounded class="ml-1" width="0"
      style="position: relative; left: 6px; min-width: 28px"
      v-bind="attrs" v-on="on">
        <v-icon dense>mdi-delete</v-icon>
      </v-btn>

    </template>



      
    <v-card>

      <v-card-title>
        Delete module
      </v-card-title>

      <v-card-text>

        Are you sure you want to delete {{ module.name }}?

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="primary" text @click="
        $store.commit('deleteModule', module.id); active = false">
          Yes
        </v-btn>

        <v-btn color="primary" text @click="active = false">
          No
        </v-btn>

      </v-card-actions>

    </v-card>



  </v-dialog>


</template>

<script>
import { mapFields } from 'vuex-map-fields'


export default {


  props: {
    module: { type: Object },
  },



  data() {
    return {
      active: false,
    }
  },


}
</script>

<style>

</style>