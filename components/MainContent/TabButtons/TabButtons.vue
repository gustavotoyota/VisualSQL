<template>
  <div style="flex: none; display: flex; background-color: #1E1E1E">



    <v-btn rounded style="flex: none; height: 48px; min-width: 48px;
    border-top-left-radius: 0; border-bottom-left-radius: 0" width="0"
    @click="leftSidebar = !leftSidebar">
      <span style="position: relative; left: -2px; top: 1px">
        <v-icon v-if="leftSidebar" dense>mdi-chevron-double-left</v-icon>
        <v-icon v-else dense>mdi-chevron-double-right</v-icon>
      </span>
    </v-btn>



    <v-tabs show-arrows style="flex: 1; width: 0"
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



    <v-btn rounded style="flex: none; height: 48px; min-width: 48px;
    border-top-right-radius: 0; border-bottom-right-radius: 0" width="0"
    @click="rightSidebar = !rightSidebar">
      <span style="position: relative; left: 2px; top: 1px">
        <v-icon v-if="rightSidebar" dense>mdi-chevron-double-right</v-icon>
        <v-icon v-else dense>mdi-chevron-double-left</v-icon>
      </span>
    </v-btn>
    


  </div>
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



    ..._vuex.mapFields({
      'leftSidebar': 'sidebars.left',
      'rightSidebar': 'sidebars.right',
    }),



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