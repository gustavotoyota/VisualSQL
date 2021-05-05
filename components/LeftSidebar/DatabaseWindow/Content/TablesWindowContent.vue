<template>
  <v-list dense style="flex: 1; overflow-y: auto">
    

    <draggable v-model="tables" delay="250"
    touch-start-threshold="4" animation="200">


      <TableItem
      v-for="table in tables" :key="table.id"
      :table="table">
      </TableItem>


    </draggable>


  </v-list>
</template>

<script>
export default {


  computed: {
    ..._vuex.mapFields([
      'project.tables',
    ]),
  },


}
</script>

<style>

</style>