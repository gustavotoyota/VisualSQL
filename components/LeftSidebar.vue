<template>
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
          v-for="(module, id) in modules" :key="id">
            
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
          v-for="(table, id) in tables" :key="id">

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
</template>

<script>
export default {
  props: {
    modules: {},
    tables: {},
  }
}
</script>

<style>

</style>