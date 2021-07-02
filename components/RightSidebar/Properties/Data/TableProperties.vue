<template>
  <div v-if="node.type === 'table'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Referenced table (FROM):
      </div>

      <v-combobox ref="combobox" class="mt-1" dense solo hide-details
      :items="tableNames" v-model="node.props.tableName"
      :search-input.sync="$state.tableProps.searchInput">
      </v-combobox>
    </div>


  </div>
</template>

<script>
export default {


  props: {
    module: Object,
    node: Object,
  },



  computed: {

    tableNames() {
      const tableNames = []

      for (const table of $state.project.tables.list)
        tableNames.push(table.name)

      return tableNames
    },

  },
  

}
</script>

<style>

</style>