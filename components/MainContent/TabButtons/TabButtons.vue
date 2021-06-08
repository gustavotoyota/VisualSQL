<template>
  <div style="flex: none; display: flex; background-color: #1E1E1E">



    <v-btn rounded style="flex: none; height: 48px; min-width: 48px;
    border-top-left-radius: 0; border-bottom-left-radius: 0" width="0"
    @click="$state.sidebars.left = !$state.sidebars.left">
      <span style="position: relative; left: -2px; top: 1px">
        <v-icon v-if="$state.sidebars.left" dense>mdi-chevron-double-left</v-icon>
        <v-icon v-else dense>mdi-chevron-double-right</v-icon>
      </span>
    </v-btn>



    <v-tabs show-arrows style="flex: 1; width: 0"
    v-model="tabIdx" :key="'t' + $state.project.rerenderTabs">

      <draggable v-model="$state.project.tabs" @end="$state.project.rerenderTabs++"
      delay="250" touch-start-threshold="4" animation="200"
      class="v-slide-group__content v-tabs-bar__content">

        <TabButton
        v-for="tab in $state.project.tabs" :key="tab.id"
        :tab="tab" :module="$getters.getModule(tab.moduleId)"/>

      </draggable>

    </v-tabs>



    <v-btn rounded style="flex: none; height: 48px; min-width: 48px;
    border-top-right-radius: 0; border-bottom-right-radius: 0" width="0"
    @click="$state.sidebars.right = !$state.sidebars.right">
      <span style="position: relative; left: 2px; top: 1px">
        <v-icon v-if="$state.sidebars.right" dense>mdi-chevron-double-right</v-icon>
        <v-icon v-else dense>mdi-chevron-double-left</v-icon>
      </span>
    </v-btn>
    


  </div>
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