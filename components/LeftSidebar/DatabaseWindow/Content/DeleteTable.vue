<template>
  <v-dialog max-width="250" eager
  v-model="active">


    <template v-slot:activator="{ on, attrs }">

      <v-btn small rounded class="ml-1" width="0"
      style="position: relative; left: 6px; min-width: 28px"
      v-bind="attrs" v-on="on">
        <v-icon dense>mdi-trash-can-outline</v-icon>
      </v-btn>

    </template>

    
    <v-card>

      <v-card-title>
        Delete table
      </v-card-title>

      <v-card-text>

        Are you sure you want to delete {{ table.name }}?

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="primary" text @click="active = false; deleteTable()">
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
export default {


  props: {
    table: { type: Object },
  },



  data() {
    return {
      active: false,
    }
  },



  computed: {
    ..._vuex.mapFields([
      'tables',
    ]),
    
    ..._vuex.mapGetters([
      'getTable',
      'getTableIdx',
    ]),
  },


  methods: {
    deleteTable() {
      this.tables.splice(
        this.getTableIdx(this.table.id), 1)
    }
  }


}
</script>

<style>

</style>