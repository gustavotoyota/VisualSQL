<template>
  <div style="width: 0; height: 0; position: absolute"
  :style="{ left: `${node.pos.x}px`, top: `${node.pos.y}px` }">



    <v-btn x-large @pointerdown="onPointerDown"
    style="min-width: 0; width: 52px; padding: 0;
    transform: translate(-50%, -50%); pointer-events: auto"
    :color="active ? 'light-blue darken-1' : (selected ? 'light-blue darken-4' : '')">
      <NodeIcon :type="node.type" large></NodeIcon>
    </v-btn>




    <NodeSockets :tab="tab" :node="node">
    </NodeSockets>




    <div class="body-2" style="position: absolute; bottom: 34px;
    transform: translateX(-50%); text-align: center;
    max-width: 150px; width: max-content; word-break: break-word">
      {{ node.props.name }}
    </div>



    <div class="body-2" style="position: absolute; top: 34px;
    transform: translateX(-50%); text-align: center;
    max-width: 150px; width: max-content; word-break: break-word;
    white-space: pre-wrap">{{ node.props.description }}</div>
    


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
      return this.tab.nodes.activeId === this.node.id
    },

  },



  methods: {

    onPointerDown(event) {
      if (event.button === 0)
        event.stopPropagation()
      else
        return



      if (!event.ctrlKey && !this.selected)
        $commit('clearSelection')
      else
        this.tab.links.activeId = null


      if (event.ctrlKey && this.selected) {
        $delete(this.tab.nodes.selected, this.node.id)

        this.tab.nodes.activeId = null
      } else {
        $set(this.tab.nodes.selected, this.node.id, true)
        
        this.tab.nodes.activeId = this.node.id
      }



      const displayPos = $getters.getDisplayPos(event)

      $state.dragging.active = true
      $state.dragging.currentPos = { ...displayPos }
      $state.dragging.saveState = false
    },

  },



}
</script>

<style>

</style>