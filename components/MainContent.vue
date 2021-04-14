<template>
  <v-main>



    <!-- Tabs -->

    <v-tabs show-arrows style="flex: none"
    v-model="tabIdx" :key="'t' + rerenderTabs">

      <draggable v-model="tabs" @end="rerenderTabs++"
      delay="250" touch-start-threshold="4" animation="200"
      class="v-slide-group__content v-tabs-bar__content">

        <v-tab v-for="tab in tabs" :key="tab.id"
        class="text-none">

          {{ modules[tab.moduleId].name }}

          <v-btn plain small rounded width="0"
          style="position: relative; left: 6px; min-width: 28px">
            <v-icon dense>mdi-close</v-icon>
          </v-btn>

        </v-tab>

      </draggable>

    </v-tabs>




    <!-- Tab items -->
    
    <v-tabs-items style="flex: 1" touchless mandatory
    v-model="tabIdx" :key="'i' + rerenderTabs">



      <!-- Tab item -->

      <ModuleTab :tab="tab" :module="modules[tab.moduleId]"
      v-for="tab in tabs" :key="tab.id"
      ></ModuleTab>



    </v-tabs-items>




  </v-main>
</template>

<script>
export default {
  props: {
    
    modules: { type: Object },

  },


  data() {
    return {

      rerenderTabs: 0,



      
      tabs: [
        {
          id: 0,
          moduleId: 0,

          camera: {
            pos: { x: 0, y: 0 },
            zoom: 1,

            panning: false,
            panPos: { x: 0, y: 0 },
          },
        },

        {
          id: 1,
          moduleId: 1,

          camera: {
            pos: { x: 0, y: 0 },
            zoom: 1,
            
            panning: false,
            panPos: { x: 0, y: 0 },
          },
        },
      ],

      tabId: null,

    }
  },



  computed: {

    tabIdx: {
      get: function () {
        return this.tabs.indexOf(
          this.tabs.find((tab) => tab.id === this.tabId))
      },
      set: function (newValue) {
        this.tabId = this.tabs[newValue].id
      },
    },

  },



}
</script>

<style>

</style>