<template>
  <div v-if="node.type === 'table'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Referenced table (FROM):
      </div>

      <v-combobox class="mt-1" dense solo hide-details
      :items="tableNames" v-model="node.props.tableName"
      @blur="onBlur">
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
      let tableNames = []

      for (let table of $state.project.tables.list)
        tableNames.push(table.name)

      return tableNames
    },

  },



  methods: {

    onBlur(event) {
      if (this.node.props.tableName === event.target.value)
        return

      this.node.props.tableName = event.target.value

      $commit('saveState')
    },

  },

}
</script>

<style>

</style>