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
    permanent clipped touchless>
      


      <!-- Modules window -->

      <div style="flex: 1; height: 0"
      class="d-flex flex-column">



        <!-- Modules header -->

        <v-toolbar dense style="flex: none">


          <v-toolbar-title>

            <v-icon>mdi-cube-outline</v-icon>

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
                  <v-icon>mdi-cube-outline</v-icon>
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

      <v-tabs show-arrows style="flex: none"
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




      <!-- Tab items -->
      
      <v-tabs-items style="flex: 1" touchless mandatory
      v-model="tabIdx" :key="'i' + rerenderTabs">



        <!-- Tab item -->

        <v-tab-item class="fill-height"
        v-for="tab in tabs" :key="tab.id">

          <div class="fill-height d-flex flex-column">



            <!-- Tab toolbar -->
            
            <v-toolbar dense style="flex: none">

              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-content-cut</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-content-paste</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-delete</v-icon>
              </v-btn>

              <v-divider vertical inset class="mx-2"></v-divider>

              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-undo</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-redo</v-icon>
              </v-btn>

              <v-divider vertical inset class="mx-2"></v-divider>

              <v-btn depressed small style="min-width: 28px" width="0">
                <v-icon dense>mdi-content-duplicate</v-icon>
              </v-btn>

              <v-divider vertical inset class="mx-2"></v-divider>

              <v-btn depressed small>
                Generate SQL
              </v-btn>

            </v-toolbar>
            



            <!-- Tab content -->

            <div style="position: relative; flex: 1; height: 0">


              
              <!-- World centralizer -->

              <div style="position: absolute; left: 50%; top: 50%">
                
                <v-btn x-large style="min-width: 52px" width="0">
                  <v-icon large>mdi-table</v-icon>
                </v-btn>

              </div>



              <!-- Node buttons -->

              <div style="position: absolute; left: 16px; top: 16px">


                <div>


                  <!-- Table node -->

                  <node-button tooltip="Table">
                    <v-icon>mdi-table</v-icon>
                  </node-button>


                  <!-- Union all node -->

                  <node-button tooltip="Union all">
                    <v-icon>mdi-vector-arrange-above</v-icon>
                  </node-button>



                </div>
                

                <div style="margin-top: 1px">


                  <!-- Module node -->

                  <node-button tooltip="Module">
                    <v-icon>mdi-cube-outline</v-icon>
                  </node-button>


                  <!-- Union node -->

                  <node-button tooltip="Union">
                    <v-icon>mdi-vector-combine</v-icon>
                  </node-button>


                </div>

                <div style="margin-top: 1px">


                  <!-- Node node -->
                  
                  <node-button tooltip="Node">
                    <v-icon>mdi-hexagon-outline</v-icon>
                  </node-button>


                  <!-- Except node -->
                  
                  <node-button tooltip="Except">
                    <v-icon>mdi-vector-difference-ba</v-icon>
                  </node-button>


                </div>

                <div style="margin-top: 1px">


                  <!-- SQL node -->
                  
                  <node-button tooltip="SQL">
                    <v-icon>mdi-code-tags</v-icon>
                  </node-button>

                  
                  <!-- Intersect node -->
                  
                  <node-button tooltip="Intersect">
                    <v-icon>mdi-vector-intersection</v-icon>
                  </node-button>


                </div>

                <div style="margin-top: 12px">

                  
                  <!-- Inner join node -->
                  
                  <node-button tooltip="Inner join">
                    <v-icon>mdi-set-center</v-icon>
                  </node-button>


                  <!-- Where node -->
                  
                  <node-button tooltip="Where">
                    <v-icon>mdi-filter</v-icon>
                  </node-button>
                  

                </div>

                <div style="margin-top: 1px">
                  

                  <!-- Left join node -->
                  
                  <node-button tooltip="Left join">
                    <v-icon>mdi-set-left-center</v-icon>
                  </node-button>

                  
                  <!-- Transform node -->
                  
                  <node-button tooltip="Transform">
                    <v-icon>mdi-cached</v-icon>
                  </node-button>
                  

                </div>

                <div style="margin-top: 1px">

                  
                  <!-- Right join node -->
                  
                  <node-button tooltip="Right join">
                    <v-icon>mdi-set-center-right</v-icon>
                  </node-button>

                  
                  <!-- Distinct node -->
                  
                  <node-button tooltip="Distinct">
                    <v-icon>mdi-format-list-bulleted-type</v-icon>
                  </node-button>


                </div>

                <div style="margin-top: 1px">

                  
                  <!-- Full join node -->
                  
                  <node-button tooltip="Full join">
                    <v-icon>mdi-set-left-right</v-icon>
                  </node-button>

                  
                  <!-- Order node -->
                  
                  <node-button tooltip="Order">
                    <v-icon>mdi-sort-ascending</v-icon>
                  </node-button>


                </div>

                <div style="margin-top: 1px">

                  
                  <!-- Cross join node -->
                  
                  <node-button tooltip="Cross join">
                    <v-icon>mdi-shuffle</v-icon>
                  </node-button>

                  
                  <!-- Reduce node -->
                  
                  <node-button tooltip="Reduce">
                    <v-icon>mdi-arrow-expand-vertical</v-icon>
                  </node-button>


                </div>

                <div style="margin-top: 12px">

                  
                  <!-- Pivot node -->
                  
                  <node-button tooltip="Pivot">
                    <span class="material-icons">pivot_table_chart</span>
                  </node-button>

                  
                  <!-- Output node -->
                  
                  <node-button tooltip="Output">
                    <v-icon>mdi-logout-variant</v-icon>
                  </node-button>
                </div>

              </div>



              <!-- Camera buttons -->

              <div style="position: absolute; right: 16px; top: 16px">

                <div>
                  <v-btn style="min-width: 36px" width="0">
                    <span class="material-icons">zoom_in</span>
                  </v-btn>
                </div>
                <div style="margin-top: 1px">
                  <v-btn style="min-width: 36px" width="0">
                    <span class="material-icons">zoom_out</span>
                  </v-btn>
                </div>
                <div style="margin-top: 1px">
                  <v-btn style="min-width: 36px" width="0">
                    <v-icon>mdi-crop-free</v-icon>
                  </v-btn>
                </div>

              </div>



            </div>



          </div>

        </v-tab-item>



      </v-tabs-items>




    </v-main>





    <!-- Right sidebar -->

    <v-navigation-drawer app width="300"
    permanent clipped right touchless>



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



      rerenderTabs: 0,



      modules: [
        { id: 0, name: 'module_1' },
        { id: 1, name: 'module_2' },
        { id: 2, name: 'module_3' },
        { id: 3, name: 'module_4' },
        { id: 4, name: 'module_5' },
      ],



      tables: [
        { id: 0, name: 'table_1' },
        { id: 1, name: 'table_2' },
        { id: 2, name: 'table_3' },
        { id: 3, name: 'table_4' },
        { id: 4, name: 'table_5' },
      ],

      

      tabs: [
        {
          id: 0,
          module: 0,

          camera: {
            zoom: 1,
            pos: { x: 0, y: 0 },
          },
        },

        {
          id: 1,
          module: 1,

          camera: {
            zoom: 1,
            pos: { x: 0, y: 0 },
          },
        },
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
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}




/* Hide scrollbar */

html {
  overflow-y: auto;
}



/* Disable pull-to-refresh */

html {
  overscroll-behavior-y: none;
}




/* Sidebars */

.v-navigation-drawer__content {
  height: 100%;

  display: flex;
  flex-direction: column;
}



/* Tab height */

.v-window__container {
  height: 100% !important;
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