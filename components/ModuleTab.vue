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
            <NodeButton type="table"></NodeButton>
            <NodeButton type="union-all"></NodeButton>
          </div>
          
          <div style="margin-top: 1px">
            <NodeButton type="module"></NodeButton>
            <NodeButton type="union"></NodeButton>
          </div>

          <div style="margin-top: 1px">
            <NodeButton type="node"></NodeButton>
            <NodeButton type="except"></NodeButton>
          </div>

          <div style="margin-top: 1px">
            <NodeButton type="sql"></NodeButton>
            <NodeButton type="intersect"></NodeButton>
          </div>

          <div style="margin-top: 12px">
            <NodeButton type="inner-join"></NodeButton>
            <NodeButton type="filter"></NodeButton>
          </div>

          <div style="margin-top: 1px">
            <NodeButton type="left-join"></NodeButton>
            <NodeButton type="transform"></NodeButton>
          </div>

          <div style="margin-top: 1px">
            <NodeButton type="right-join"></NodeButton>
            <NodeButton type="distinct"></NodeButton>
          </div>

          <div style="margin-top: 1px">
            <NodeButton type="full-join"></NodeButton>
            <NodeButton type="sort"></NodeButton>
          </div>

          <div style="margin-top: 1px">
            <NodeButton type="cross-join"></NodeButton>
            <NodeButton type="reduce"></NodeButton>
          </div>

          <div style="margin-top: 12px">
            <NodeButton type="pivot"></NodeButton>
            <NodeButton type="reduce"></NodeButton>
          </div>

        </div>



        <!-- Camera buttons -->

        <div style="position: absolute; right: 16px; top: 16px">
          
          <div style="margin-top: 1px">
            <v-btn style="min-width: 36px" width="0" @click="tab.camera.zoom = 1">
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