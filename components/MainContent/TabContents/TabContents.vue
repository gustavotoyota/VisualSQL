<template>
  <v-tabs-items style="flex: 1" touchless mandatory
  v-model="tabIdx" :key="'i' + $state.tabs.rerender">


    <TabContent
    v-for="tab in $state.project.tabs.list" :key="tab.id"
    :tab="tab" :module="$getters.getModule(tab.moduleId)"/>


  </v-tabs-items>
</template>

<script>
export default {


  computed: {

    tabIdx: {
      get() {
        return $getters.getTabIdx($state.project.tabs.currentId)
      },
      set(value) {
        $state.project.tabs.currentId = $state.project.tabs.list[value || 0].id
      },
    },

  },


}
</script>

<style>

</style>