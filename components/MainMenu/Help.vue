<template>

  <v-dialog max-width="650" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton v-on="dialog"
      btn-style="width: auto">
        Help
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>Help</v-card-title>
      
      <v-divider/>

      <v-card-text style="padding: 0; display: flex; height: 360px">

        <v-list dense style="width: 175px; overflow-y: scroll;
        border-right: 1px solid #383838">

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Creating nodes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Linking nodes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Node types</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Generating SQL</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Using modules</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Named nodes</v-list-item-title>
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

        <div style="flex: 1; overflow-y: scroll;
        background-color: #101010;
        padding-top: 30px; padding-left: 30px">

          <img src="/help/creating-nodes.png"
          style="display: block; outline: 1px solid #505050; margin-bottom: 31px"/>

          <img src="/help/linking-nodes.png"
          style="display: block; outline: 1px solid #505050; margin-bottom: 31px"/>

          <img src="/help/node-types.png"
          style="display: block; outline: 1px solid #505050; margin-bottom: 31px"/>

          <img src="/help/generating-sql.png"
          style="display: block; outline: 1px solid #505050; margin-bottom: 31px"/>

          <img src="/help/using-modules.png"
          style="display: block; outline: 1px solid #505050; margin-bottom: 31px"/>

          <img src="/help/named-nodes.png"
          style="display: block; outline: 1px solid #505050; margin-bottom: 31px"/>

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