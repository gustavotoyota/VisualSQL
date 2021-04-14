<template>
  <div style="width: 0; height: 0; position: absolute"
  :style="{ left: `${node.pos.x}px`, top: `${node.pos.y}px` }">

    <v-btn x-large style="min-width: 52px; transform: translate(-50%, -50%)" width="0"
    :color="selected ? 'light-blue darken-4' : ''"
    @mousedown="$emit('mousedown', node, $event)">
      
      <NodeIcon :type="node.type" :large="true"></NodeIcon>

    </v-btn>

    
    <NodeSocket style="left: 34px">
    </NodeSocket>

    <NodeSocket style="left: -34px">
    </NodeSocket>

  </div>

</template>

<script>
export default {


  props: {
    node: { type: Object },
    selected: { type: Boolean },
  },

}
</script>

<style>
</style>