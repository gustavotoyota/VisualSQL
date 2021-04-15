<template>
  <v-list dense style="overflow-y: scroll; flex: 1">
    

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
import { mapFields } from 'vuex-map-fields'


export default {


  computed: {
    ...mapFields([
      'tables',
    ]),
  },


}
</script>

<style>

</style>