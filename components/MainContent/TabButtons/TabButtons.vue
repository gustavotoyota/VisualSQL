<template>
  <v-tabs show-arrows style="flex: none"
  v-model="tabIdx" :key="'t' + rerenderTabs">

    <draggable v-model="tabs" @end="rerenderTabs++"
    delay="250" touch-start-threshold="4" animation="200"
    class="v-slide-group__content v-tabs-bar__content">

      <TabButton
      v-for="tab in tabs" :key="tab.id"
      :tab="tab" :module="getModule(tab.moduleId)">
      </TabButton>

    </draggable>

  </v-tabs>
</template>

<script>
export default {


  computed: {


    ..._vuex.mapFields([
      'modules',

      'tabs',

      'tabId',
      'rerenderTabs',
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