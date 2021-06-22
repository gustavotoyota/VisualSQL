<template>
  <div style="flex: none; display: flex; background-color: #1E1E1E; justify-content: center">



    <v-btn rounded style="flex: none; min-width: 0; width: 48px; height: 48px;
    border-top-left-radius: 0; border-bottom-left-radius: 0"
    @click="toggleLeftSidebar">
      <span style="position: relative; left: -2px; top: 1px">
        <v-icon v-if="$state.sidebars.left" dense>mdi-chevron-double-left</v-icon>
        <v-icon v-else dense>mdi-chevron-double-right</v-icon>
      </span>
    </v-btn>



    <v-tabs show-arrows style="flex: 1; width: 0"
    v-model="tabIdx" :key="'t' + $state.tabs.rerender">

      <draggable v-model="$state.project.tabs.list" @end="$state.tabs.rerender++"
      delay="250" touch-start-threshold="4" animation="200"
      class="v-slide-group__content v-tabs-bar__content">

        <TabButton
        v-for="tab in $state.project.tabs.list" :key="tab.id"
        :tab="tab" :module="$getters.getModule(tab.moduleId)"/>

      </draggable>

    </v-tabs>



    <v-btn rounded style="flex: none; min-width: 0; width: 48px; height: 48px;
    border-top-right-radius: 0; border-bottom-right-radius: 0"
    @click="toggleRightSidebar">
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
        return this.$getters.getTabIdx(this.$state.project.tabs.currentId)
      },
      set(value) {
        this.$state.project.tabs.currentId = this.$state.project.tabs.list[value || 0].id
      },
    },

  },



  methods: {

    toggleLeftSidebar() {
      this.$state.sidebars.left = !this.$state.sidebars.left

      if (this.$state.sidebars.left && innerWidth < 697)
        this.$state.sidebars.right = false
    },
    
    toggleRightSidebar() {
      this.$state.sidebars.right = !this.$state.sidebars.right

      if (this.$state.sidebars.right && innerWidth < 697)
        this.$state.sidebars.left = false
    },

  },


}
</script>

<style>

</style>