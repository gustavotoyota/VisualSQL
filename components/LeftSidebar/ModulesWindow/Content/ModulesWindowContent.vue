<template>
  <v-list dense style="flex: 1; overflow-y: scroll">
      

    <draggable v-model="modules" delay="250"
    touch-start-threshold="4" animation="200">


      <ModuleItem
      v-for="module in modules" :key="module.id"
      :module="module">
      </ModuleItem>


    </draggable>


  </v-list>
</template>

<script>
export default {


  computed: {
    ..._vuex.mapFields([
      'modules',
    ]),
  },


}
</script>

<style>

</style>