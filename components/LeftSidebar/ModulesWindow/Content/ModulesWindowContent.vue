<template>
  <v-list dense style="flex: 1; overflow-y: auto">
      

    <draggable v-model="$state.project.modules.list" delay="250"
    touch-start-threshold="4" animation="200">


      <ModuleItem
      v-for="module in $state.project.modules.list" :key="module.id"
      :module="module"/>


    </draggable>


  </v-list>
</template>

<script>
export default {
}
</script>

<style>

</style>