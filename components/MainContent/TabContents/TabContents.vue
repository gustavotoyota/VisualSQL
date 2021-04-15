<template>
  <v-tabs-items style="flex: 1" touchless mandatory
  v-model="tabIdx" :key="'i' + rerenderTabs">


    <TabContent
    v-for="tab in tabs" :key="tab.id"
    :tab="tab" :module="modules[tab.moduleId]">
    </TabContent>


  </v-tabs-items>
</template>

<script>
import vuex from 'vuex'
import { mapFields } from 'vuex-map-fields'


export default {


  computed: {


    ...mapFields([
      'modules',

      'tabs',

      'tabId',
      'rerenderTabs',
    ]),



    ...vuex.mapGetters([
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