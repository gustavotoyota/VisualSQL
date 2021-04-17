<template>



  <!-- Loading screen -->

  <v-app dark v-if="loading">

  </v-app>





  <v-app dark v-else>




    <!-- App bar -->

    <v-app-bar app clipped-left clipped-right dense>

      <v-app-bar-title>
        Visual SQL Tool
      </v-app-bar-title>

      <v-divider vertical inset class="ml-4 mr-2"></v-divider>

      <v-btn depressed small style="min-width: 28px" width="0">
        <v-icon dense>mdi-file</v-icon>
      </v-btn>
      <v-btn depressed small style="min-width: 28px" width="0">
        <v-icon dense>mdi-folder-open</v-icon>
      </v-btn>
      <v-btn depressed small style="min-width: 28px" width="0">
        <v-icon dense>mdi-content-save</v-icon>
      </v-btn>

      <v-divider vertical inset class="mx-2"></v-divider>

      <v-btn depressed small style="min-width: 28px" width="0">
        <v-icon dense>mdi-cog</v-icon>
      </v-btn>

      <v-divider vertical inset class="mx-2"></v-divider>

      <v-btn depressed small style="min-width: 28px" width="0">
        <v-icon dense>mdi-help-circle</v-icon>
      </v-btn>



      <v-spacer></v-spacer>

    </v-app-bar>





    <!-- Left sidebar -->

    <v-navigation-drawer app width="300"
    :permanent="leftSidebar" clipped touchless>
      


      <!-- Modules window -->

      <div style="flex: 1; height: 0"
      class="d-flex flex-column">



        <!-- Modules header -->

        <v-toolbar dense style="flex: none">


          <v-toolbar-title>

            <v-icon>mdi-view-dashboard</v-icon>

            <span style="position: relative; top: 2px">Modules</span>

          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn depressed rounded class="mt-1" width="0" height="32"
          style="position: relative; left: 8px; min-width: 32px">
            <v-icon dense>mdi-plus-thick</v-icon>
          </v-btn>

          
        </v-toolbar>




        <!-- Modules content -->

        <v-list dense style="flex: 1; overflow-y: scroll">
          

          <draggable delay="250" touch-start-threshold="4" animation="200">


            <!-- Module item -->

            <v-hover v-slot="{ hover }"
            v-for="module in modules" :key="module.id">
              
              <v-list-item @click="() => {}">

                <v-list-item-icon>
                  <v-icon>mdi-view-module</v-icon>
                </v-list-item-icon>
                    
                <v-list-item-content>
                  <v-list-item-title class="body-2"
                  style="word-break: break-all; white-space: normal">
                    {{ module.name }}
                  </v-list-item-title>
                </v-list-item-content>
                    
                <v-btn small rounded class="ml-1" width="0" v-visible="hover"
                style="position: relative; left: 6px; min-width: 28px">
                  <v-icon dense>mdi-trash-can-outline</v-icon>
                </v-btn>

              </v-list-item>

            </v-hover>


          </draggable>


        </v-list>



      </div>




      <!-- Database window -->

      <div style="flex: 1; height: 0"
      class="d-flex flex-column">



        <!-- Database header -->

        <v-toolbar dense style="flex: none">

          <v-toolbar-title>
            <v-icon>mdi-database</v-icon>
            <span style="position: relative; top: 1px">Database</span>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn depressed rounded class="ml-2 mt-1" width="32" height="32"
          style="position: relative; left: 8px; min-width: 32px">
            <v-icon dense>mdi-plus-thick</v-icon>
          </v-btn>

          <v-btn depressed rounded class="ml-2 mt-1" width="32" height="32"
          style="position: relative; left: 8px; min-width: 32px">
            <v-icon dense>mdi-cog</v-icon>
          </v-btn>

        </v-toolbar>




        <!-- Database content -->

        <v-list dense style="overflow-y: scroll; flex: 1">
          
          <draggable delay="250" touch-start-threshold="4" animation="200">

            

            <!-- Table item -->

            <v-hover v-slot="{ hover }"
            v-for="table in tables" :key="table.id">

              <v-list-item @click="() => {}">

                <v-list-item-icon>
                  <v-icon>mdi-table</v-icon>
                </v-list-item-icon>
                
                <v-list-item-content>
                  <v-list-item-title class="body-2"
                  style="word-break: break-all; white-space: normal">
                    {{ table.name }}
                  </v-list-item-title>
                </v-list-item-content>
                
                <v-btn small rounded class="ml-1" width="0" v-visible="hover"
                style="position: relative; left: 6px; min-width: 28px">
                  <v-icon dense>mdi-trash-can-outline</v-icon>
                </v-btn>

              </v-list-item>
            
            </v-hover>



          </draggable>

        </v-list>



      </div>




    </v-navigation-drawer>



    

    <!-- Main content -->

    <v-main>



      <!-- Tabs -->

      <div style="flex: none; display: flex; background-color: #1E1E1E">


        <v-btn style="flex: none; height: 48px; border-radius: 9999px;
        border-top-left-radius: 0; border-bottom-left-radius: 0; min-width: 48px" width="0"
        @click="leftSidebar = !leftSidebar">
          <v-icon v-if="leftSidebar" dense>mdi-chevron-double-left</v-icon>
          <v-icon v-else dense>mdi-chevron-double-right</v-icon>
        </v-btn>


        <v-tabs show-arrows style="flex: 1; width: 0"
        v-model="tabIdx" :key="'t' + rerenderTabs">

          <draggable v-model="tabs" @end="rerenderTabs++"
          delay="250" touch-start-threshold="4" animation="200"
          class="v-slide-group__content v-tabs-bar__content">

            <v-tab v-for="tab in tabs" :key="tab.id"
            class="text-none">

              {{ modules[tab.module].name }}

              <v-btn plain small rounded width="0"
              style="position: relative; left: 6px; min-width: 28px">
                <v-icon dense>mdi-close</v-icon>
              </v-btn>

            </v-tab>

          </draggable>

        </v-tabs>



        <v-btn rounded style="flex: none; height: 48px; min-width: 48px;
        border-top-right-radius: 0; border-bottom-right-radius: 0" width="0"
        @click="rightSidebar = !rightSidebar">
          <v-icon v-if="rightSidebar" dense>mdi-chevron-double-right</v-icon>
          <v-icon v-else dense>mdi-chevron-double-left</v-icon>
        </v-btn>


      </div>




      <!-- Tab items -->
      
      <v-tabs-items style="flex: 1"
      v-model="tabIdx" :key="'i' + rerenderTabs">



        <!-- Tab item -->

        <v-tab-item v-for="tab in tabs" :key="tab.id"
        class="fill-height flex-column" style="display: flex">



          <!-- Tab toolbar -->
          
          <v-toolbar dense style="flex: none">

            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-content-cut</v-icon>
            </v-btn>
            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-content-paste</v-icon>
            </v-btn>
            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-delete</v-icon>
            </v-btn>

            <v-divider vertical inset class="mx-2"></v-divider>

            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-undo</v-icon>
            </v-btn>
            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-redo</v-icon>
            </v-btn>

            <v-divider vertical inset class="mx-2"></v-divider>

            <v-btn depressed small style="min-width: 28px; width: 28px">
              <v-icon dense>mdi-content-duplicate</v-icon>
            </v-btn>

            <v-divider vertical inset class="mx-2"></v-divider>

            <v-btn depressed small>
              Generate SQL
            </v-btn>

          </v-toolbar>
          



          <!-- Tab content -->

          <div style="flex: 1">



            {{ modules[tab.module].name }}



          </div>





        </v-tab-item>

      </v-tabs-items>




    </v-main>





    <!-- Right sidebar -->

    <v-navigation-drawer app width="300" right
    permanent v-if="rightSidebar" clipped touchless>



      <!-- Properties header -->

      <v-toolbar dense style="flex: none">
        <v-toolbar-title>
          <v-icon>mdi-chart-box</v-icon>
          <span style="position: relative; top: 2px">Properties</span>
        </v-toolbar-title>
      </v-toolbar>




      <!-- Properties content -->

      <div class="pa-5"
      style="flex: 1; height: 0; overflow-y: scroll">

      </div>




    </v-navigation-drawer>




  </v-app>



</template>


<script>
export default {
  
  
  data() {
    return {


      loading: false,



      leftSidebar: true,
      rightSidebar: true,


      rerenderTabs: 0,



      modules: [
        { id: 0, name: 'module_1' },
        { id: 1, name: 'module_2' },
        { id: 2, name: 'module_3' },
        { id: 3, name: 'module_4' },
        { id: 4, name: 'module_5' },
        { id: 5, name: 'module_6' },
        { id: 6, name: 'module_7' },
      ],



      tables: [
        { id: 0, name: 'table_1' },
        { id: 1, name: 'table_2' },
        { id: 2, name: 'table_3' },
        { id: 3, name: 'table_4' },
        { id: 4, name: 'table_5' },
      ],

      

      tabs: [
        { id: 0, module: 0 },
        { id: 1, module: 1 },
        { id: 2, module: 2 },
        { id: 3, module: 3 },
        { id: 4, module: 4 },
        { id: 5, module: 5 },
        { id: 6, module: 6 },
      ],
      tabId: null,


    }
  },


  mounted() {
    window.addEventListener('load', () => {
      this.loading = false
    })
  },



  computed: {

    tabIdx: {
      get: function () {
        return this.tabs.indexOf(
          this.tabs.find((tab) => tab.id === this.tabId))
      },
      set: function (newValue) {
        this.tabId = this.tabs[newValue].id;
      },
    },

  },


}
</script>


<style>
/* Hide scrollbar */

html {
  overflow-y: auto
}



/* Sidebars */

.v-navigation-drawer__content {
  height: 100%;

  display: flex;
  flex-direction: column;
}



/* Tab height */

.v-window__container {
  height: 100%;
}



/* Main content height */

.v-main__wrap {
  height: 100%;

  display: flex;
  flex-direction: column;
}




/* Scrollbars */

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: #202020;
}

::-webkit-scrollbar-thumb {
  background: #303030;
  border: solid 1px #404040;
}

::-webkit-scrollbar-thumb:hover {
  background: #404040;
}
</style>