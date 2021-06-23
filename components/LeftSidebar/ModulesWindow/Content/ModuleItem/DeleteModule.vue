<template>
  <v-dialog max-width="250" v-model="active">


    <template v-slot:activator="{ on, attrs }">

      <v-list-item v-bind="attrs" v-on="on">

        <v-list-item-icon style="margin-right: 10px">
          <v-icon>mdi-delete</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Delete</v-list-item-title>

      </v-list-item>

    </template>



      
    <v-card>

      <v-card-title>
        Delete module
      </v-card-title>

      <v-card-text>

        Are you sure you want to delete {{ module.name }}?

      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer/>

        <v-btn color="primary" text ref="yes"
        @click="$commit('deleteModule', module.id); active = false">
          Yes
        </v-btn>

        <v-btn color="primary" text
        @click="active = false">
          No
        </v-btn>

      </v-card-actions>

    </v-card>



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
    }
  },



  watch: {

    active(value) {
      if (!value)
        return

      setTimeout(() => {
        this.$refs.yes.$el.focus()
      })
    },

  },


}
</script>

<style>

</style>