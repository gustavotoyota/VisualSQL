<template>

  <v-dialog max-width="600" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton v-on="dialog"
      btn-style="width: auto">
        Help
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>Help</v-card-title>
      
      <v-divider/>

      <v-card-text style="padding: 0; display: flex">

        <v-list dense style="width: 175px; height: 350px; overflow-y: auto">

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Node creation</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Node linking</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Node types</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>SQL generation</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Modules</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Node name</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Node description</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Subquery referencing</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Column tracking</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>

        <div style="flex: 1">
          asd
        </div>

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