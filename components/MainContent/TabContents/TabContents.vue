<template>
  <v-tabs-items style="flex: 1" touchless mandatory
  v-model="tabIdx" :key="'i' + $state.tabs.rerender">


    <TabContent
    v-for="tab in $state.project.tabs" :key="tab.id"
    :tab="tab" :module="$getters.getModule(tab.moduleId)"/>


  </v-tabs-items>
</template>

<script>
export default {


  computed: {

    tabIdx: {
      get() {
        return this.$getters.getTabIdx(this.$state.project.tabId)
      },
      set(value) {
        this.$state.project.tabId = this.$state.project.tabs[value || 0].id
      },
    },

  },


}
</script>

<style>

</style>