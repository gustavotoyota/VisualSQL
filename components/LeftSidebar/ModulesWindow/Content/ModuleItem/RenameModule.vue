<template>
  <v-dialog max-width="280" eager v-model="active">


    <template v-slot:activator="{ on, attrs }">

      <v-list-item v-bind="attrs" v-on="on">

        <v-list-item-icon style="margin-right: 10px">
            <v-icon>mdi-square-edit-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Rename</v-list-item-title>

      </v-list-item>

    </template>



    <v-form ref="form" @submit.prevent="
    active = false; module.name = name">
    
      <v-card>

        <v-card-title>
          Rename module
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

  props: {
    module: { type: Object },
  },

  data() {
    return {
      active: false,
      
      name: this.module.name,
    }
  },

}
</script>

<style>

</style>