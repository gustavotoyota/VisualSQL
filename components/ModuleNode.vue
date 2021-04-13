<template>
  <div style="width: 0; height: 0; position: absolute"
  :style="{ left: `${node.pos.x}px`, top: `${node.pos.y}px` }">

    <v-btn x-large style="min-width: 52px; transform: translate(-50%, -50%)" width="0"
    @click="click" :color="selected ? 'light-blue darken-4' : '  '">
      
      <v-icon v-if="node.type == 'table'" large>mdi-table</v-icon>
      <v-icon v-else-if="node.type == 'module'" large>mdi-cube-outline</v-icon>
      <v-icon v-else-if="node.type == 'node'" large>mdi-hexagon-outline</v-icon>
      <v-icon v-else-if="node.type == 'sql'" large>mdi-code-tags</v-icon>

      <v-icon v-else-if="node.type == 'union-all'" large>mdi-vector-arrange-above</v-icon>
      <v-icon v-else-if="node.type == 'union'" large>mdi-vector-combine</v-icon>
      <v-icon v-else-if="node.type == 'except'" large>mdi-vector-difference-ba</v-icon>
      <v-icon v-else-if="node.type == 'intersect'" large>mdi-vector-intersection</v-icon>
      
      <v-icon v-else-if="node.type == 'inner-join'" large>mdi-set-center</v-icon>
      <v-icon v-else-if="node.type == 'left-join'" large>mdi-set-left-center</v-icon>
      <v-icon v-else-if="node.type == 'right-join'" large>mdi-set-center-right</v-icon>
      <v-icon v-else-if="node.type == 'full-join'" large>mdi-set-left-right</v-icon>
      <v-icon v-else-if="node.type == 'cross-join'" large>mdi-shuffle</v-icon>

      <v-icon v-else-if="node.type == 'filter'" large>mdi-filter</v-icon>
      <v-icon v-else-if="node.type == 'transform'" large>mdi-cached</v-icon>
      <v-icon v-else-if="node.type == 'distinct'" large>mdi-format-list-bulleted-type</v-icon>
      <v-icon v-else-if="node.type == 'sort'" large>mdi-sort-ascending</v-icon>
      <v-icon v-else-if="node.type == 'reduce'" large>mdi-arrow-expand-vertical</v-icon>

      <span v-else-if="node.type == 'pivot'" class="material-icons">pivot_table_chart</span>
      <v-icon v-else-if="node.type == 'output'" large>mdi-logout-variant</v-icon>

    </v-btn>

    
    <div class="socket" style="left: 34px">
    </div>

    <div class="socket" style="left: -34px">
    </div>
  </div>

</template>

<script>
export default {


  props: {
    node: { type: Object },
  },


  data() {
    return {
      
      selected: false,
      
    }
  },


  methods: {

    click(event) {
      this.selected = !this.selected
    },

  },

}
</script>

<style>
  .socket {
    position: absolute;

    left: 0;
    top: 0;
    
    width: 10px;
    height: 10px;

    transform: translate(-50%, -50%);

    border-radius: 9999px;
    
    background-color: #d0d0d0;
  }
</style>