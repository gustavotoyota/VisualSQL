<template>
  <v-list dense style="flex: 1; overflow-y: auto">
    

    <draggable v-model="$state.project.tables" delay="250"
    touch-start-threshold="4" animation="200">


      <TableItem
      v-for="table in $state.project.tables" :key="table.id"
      :table="table"/>


    </draggable>


  </v-list>
</template>

<script>
export default {
}
</script>

<style>

</style>