<template>
  <v-tab-item class="fill-height">

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



        <!-- Viewport -->

        <ModuleDisplay :tab="tab" :module="module">
        </ModuleDisplay>




        <!-- Node buttons -->

        <div style="position: absolute; left: 16px; top: 16px;
        width: 0; height: 0; white-space: nowrap">


          <div>


            <!-- Table node -->

            <NodeButton tooltip="Table">
              <v-icon>mdi-table</v-icon>
            </NodeButton>


            <!-- Union all node -->

            <NodeButton tooltip="Union all">
              <v-icon>mdi-vector-arrange-above</v-icon>
            </NodeButton>



          </div>
          
          <div style="margin-top: 1px">


            <!-- Module node -->

            <NodeButton tooltip="Module">
              <v-icon>mdi-cube-outline</v-icon>
            </NodeButton>


            <!-- Union node -->

            <NodeButton tooltip="Union">
              <v-icon>mdi-vector-combine</v-icon>
            </NodeButton>


          </div>

          <div style="margin-top: 1px">


            <!-- Node node -->
            
            <NodeButton tooltip="Node">
              <v-icon>mdi-hexagon-outline</v-icon>
            </NodeButton>


            <!-- Except node -->
            
            <NodeButton tooltip="Except">
              <v-icon>mdi-vector-difference-ba</v-icon>
            </NodeButton>


          </div>

          <div style="margin-top: 1px">


            <!-- SQL node -->
            
            <NodeButton tooltip="SQL">
              <v-icon>mdi-code-tags</v-icon>
            </NodeButton>

            
            <!-- Intersect node -->
            
            <NodeButton tooltip="Intersect">
              <v-icon>mdi-vector-intersection</v-icon>
            </NodeButton>


          </div>

          <div style="margin-top: 12px">

            
            <!-- Inner join node -->
            
            <NodeButton tooltip="Inner join">
              <v-icon>mdi-set-center</v-icon>
            </NodeButton>


            <!-- Filter node -->
            
            <NodeButton tooltip="Filter">
              <v-icon>mdi-filter</v-icon>
            </NodeButton>
            

          </div>

          <div style="margin-top: 1px">
            

            <!-- Left join node -->
            
            <NodeButton tooltip="Left join">
              <v-icon>mdi-set-left-center</v-icon>
            </NodeButton>

            
            <!-- Transform node -->
            
            <NodeButton tooltip="Transform">
              <v-icon>mdi-cached</v-icon>
            </NodeButton>
            

          </div>

          <div style="margin-top: 1px">

            
            <!-- Right join node -->
            
            <NodeButton tooltip="Right join">
              <v-icon>mdi-set-center-right</v-icon>
            </NodeButton>

            
            <!-- Distinct node -->
            
            <NodeButton tooltip="Distinct">
              <v-icon>mdi-format-list-bulleted-type</v-icon>
            </NodeButton>


          </div>

          <div style="margin-top: 1px">

            
            <!-- Full join node -->
            
            <NodeButton tooltip="Full join">
              <v-icon>mdi-set-left-right</v-icon>
            </NodeButton>

            
            <!-- Sort node -->
            
            <NodeButton tooltip="Sort">
              <v-icon>mdi-sort-ascending</v-icon>
            </NodeButton>


          </div>

          <div style="margin-top: 1px">

            
            <!-- Cross join node -->
            
            <NodeButton tooltip="Cross join">
              <v-icon>mdi-shuffle</v-icon>
            </NodeButton>

            
            <!-- Reduce node -->
            
            <NodeButton tooltip="Reduce">
              <v-icon>mdi-arrow-expand-vertical</v-icon>
            </NodeButton>


          </div>

          <div style="margin-top: 12px">

            
            <!-- Pivot node -->
            
            <NodeButton tooltip="Pivot">
              <span class="material-icons">pivot_table_chart</span>
            </NodeButton>

            
            <!-- Output node -->
            
            <NodeButton tooltip="Output">
              <v-icon>mdi-logout-variant</v-icon>
            </NodeButton>
          </div>

        </div>



        <!-- Camera buttons -->

        <div style="position: absolute; right: 16px; top: 16px">
          
          <div style="margin-top: 1px">
            <v-btn style="min-width: 36px" width="0" @click="tab.zoom = 1">
              <v-icon>mdi-magnify-remove-outline</v-icon>
            </v-btn>
          </div>
          <div style="margin-top: 1px">
            <v-btn style="min-width: 36px" width="0" @click="fitCamera">
              <v-icon>mdi-crop-free</v-icon>
            </v-btn>
          </div>

        </div>



      </div>



    </div>

  </v-tab-item>
</template>

<script>
export default {


  props: {
    tab: { type: Object },
    module: { type: Object },
  },



  methods: {


    fitCamera() {
      
    },


  },

}
</script>

<style>

</style>