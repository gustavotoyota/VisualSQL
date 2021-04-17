<template>
  <div v-if="node.type === 'table'" class="mt-4">


    <div class="mb-1 body-2 grey--text text--lighten-1">
      Referenced table:
    </div>


    <v-combobox dense solo :items="tableNames"
    v-model="node.props.tableName">
    </v-combobox>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  computed: {


    ..._vuex.mapFields([
      'tables',
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