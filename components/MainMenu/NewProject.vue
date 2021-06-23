<template>

  <v-dialog max-width="270" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton tooltip="New project" v-on="{ ...dialog }">
        <v-icon dense>mdi-file</v-icon>
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>
        New project
      </v-card-title>

      <v-card-text>
        <div>The current project will be closed.</div>
        <div>Are you sure?</div>
      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer/>

        <v-btn color="primary" text ref="yes"
        @click="$commit('resetProject'); active = false">
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