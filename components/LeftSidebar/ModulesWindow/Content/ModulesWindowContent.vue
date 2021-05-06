<template>
  <v-list dense style="flex: 1; overflow-y: auto">
      

    <draggable v-model="modules" delay="250"
    touch-start-threshold="4" animation="200">


      <ModuleItem
      v-for="module in modules" :key="module.id"
      :module="module"/>


    </draggable>


  </v-list>
</template>

<script>
export default {


  computed: {
    ..._vuex.mapFields([
      'project.modules',
    ]),
  },


}
</script>

<style>

</style>