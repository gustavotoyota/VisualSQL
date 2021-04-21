<template>
  <div v-if="node.type === 'table'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Referenced table:
      </div>

      <v-combobox class="mt-1" dense solo hide-details
      :items="tableNames" v-model="node.props.tableName">
      </v-combobox>
    </div>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  computed: {


    ..._vuex.mapFields([
      'project.tables',
    ]),
    


    tableNames() {
      let tableNames = []

      for (let table of this.tables)
        tableNames.push(table.name)

      return tableNames
    },


  },

}
</script>

<style>

</style>