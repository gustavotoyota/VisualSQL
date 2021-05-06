<template>
  <v-tabs-items style="flex: 1" touchless mandatory
  v-model="tabIdx" :key="'i' + rerenderTabs">


    <TabContent
    v-for="tab in tabs" :key="tab.id"
    :tab="tab" :module="getModule(tab.moduleId)"/>


  </v-tabs-items>
</template>

<script>
export default {


  computed: {


    ..._vuex.mapFields([
      'project.modules',

      'project.tabs',
      'project.tabId',
      'project.rerenderTabs',
    ]),



    ..._vuex.mapGetters([
      'getModule',
      'getTabIdx',
    ]),

    

    tabIdx: {
      get() {
        return this.getTabIdx(this.tabId)
      },
      set(value) {
        this.tabId = this.tabs[value || 0].id
      },
    },


  },


}
</script>

<style>

</style>