<template>

  <v-dialog width="unset" v-model="displayDialog">

    <template v-slot:activator="{ on: dialogEvents }">

      <ToolbarButton
      v-on="dialogEvents"
      tooltip="Settings">
        <v-icon dense>mdi-cog</v-icon>
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>Settings</v-card-title>
      
      <v-divider/>

      <v-card-text style="display: flex; padding: 0">

        <div style="padding: 20px 24px">

          <v-radio-group hide-details
          style="margin: 0; padding: 0"
          v-model="$state.project.sql.indentWithSpaces">
            <template v-slot:label>
              <div>Indentation characters:</div>
            </template>
            
            <v-radio label="Spaces" :value="true"></v-radio>
            <v-radio label="Tabs" :value="false"></v-radio>
          </v-radio-group>

          <v-radio-group hide-details
          v-model="$state.project.sql.indentSize">
            <template v-slot:label>
              <div>Indentation size:</div>
            </template>
            
            <v-radio label="2 spaces" :value="2"></v-radio>
            <v-radio label="4 spaces" :value="4"></v-radio>
          </v-radio-group>

        </div>

        <v-divider vertical/>

        <div style="padding: 20px 24px">
          <v-checkbox
          label="Show help dialog on start"
          v-model="showWelcomeDialog"
          hide-details
          style="margin: 0"/>
        </div>
        
      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer/>

        <v-btn color="primary" text
        @click="displayDialog = false">
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
      displayDialog: false,
    }
  },



  computed: {

    showWelcomeDialog: {
      get() {
        return !global.localStorage ||
          localStorage.getItem('showWelcomeDialog') !== 'false'
      },
      set(value) {
        localStorage.setItem('showWelcomeDialog', value)
      },
    },

  },
  

}
</script>

<style>

</style>