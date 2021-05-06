<template>
  <v-dialog max-width="280" eager v-model="active">


    <template v-slot:activator="{ on }">

      <slot :on="on"/>

    </template>



    <v-form @submit.prevent="active = false; $emit('submit', fields)">
    
      <v-card>

        <v-card-title>
          {{ title }}
        </v-card-title>

        <v-card-text>

          <v-text-field label="Module name"
          autofocus v-model="fields.name">
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
    title: String,

    name: String,
  },



  data() {
    return {
      active: false,

      fields: {
        name: '',
      },
    }
  },



  watch: {

    active(value) {
      if (!value)
        return

      this.fields.name = this.name ?? ''
    }

  },


}
</script>

<style>

</style>