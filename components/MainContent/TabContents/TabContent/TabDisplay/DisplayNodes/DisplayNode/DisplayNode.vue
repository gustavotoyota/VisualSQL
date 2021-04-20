<template>
  <div style="width: 0; height: 0; position: absolute"
  :style="{ left: `${node.pos.x}px`, top: `${node.pos.y}px` }">



    <v-btn x-large width="0" @pointerdown="onPointerDown"
    style="min-width: 52px; transform: translate(-50%, -50%); pointer-events: auto"
    :color="active ? 'light-blue darken-1' : (selected ? 'light-blue darken-4' : '')">
      <NodeIcon :type="node.type" large></NodeIcon>
    </v-btn>




    <NodeSockets :tab="tab" :node="node">
    </NodeSockets>




    <div class="body-2" style="position: absolute; bottom: 34px;
    transform: translateX(-50%); text-align: center;
    max-width: 150px; width: max-content; word-break: break-all">
      {{ node.name }}
    </div>



    <div class="body-2" style="position: absolute; top: 34px;
    transform: translateX(-50%); text-align: center;
    max-width: 150px; width: max-content; word-break: break-word;
    white-space: pre-wrap">{{ node.description }}</div>
    


  </div>
</template>

<script>
export default {


  props: {
    tab: Object,
    node: Object,
  },



  computed: {

    selected() {
      return this.node.id in this.tab.nodes.selected
    },

    active() {
      return this.tab.nodes.active === this.node
    },

  },



  methods: {

    onPointerDown(event) {
    },

  },



}
</script>

<style>

</style>