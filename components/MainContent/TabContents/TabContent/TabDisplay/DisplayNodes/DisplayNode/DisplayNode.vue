<template>
  <div style="width: 0; height: 0; position: absolute; pointer-events: auto"
  :style="{ left: `${node.pos.x}px`, top: `${node.pos.y}px` }"
  @mousedown="onMouseDown">



    <v-btn x-large style="min-width: 52px; transform: translate(-50%, -50%)" width="0"
    :color="selected ? 'light-blue darken-4' : ''"
    @mousedown="$emit('mousedown', node, $event)">
      <NodeIcon :type="node.type" large></NodeIcon>
    </v-btn>



    <NodeSockets :node="node">
    </NodeSockets>



    <div style="position: absolute; bottom: 32px; pointer-events: none">
      <div class="body-2" style="position: relative; left: -50%;
      text-align: center; max-width: 150px; width: max-content; word-wrap: break-word">
        {{ node.name }}
      </div>
    </div>



    <div style="position: absolute; top: 32px; pointer-events: none">
      <div class="body-2" style="position: relative; left: -50%;
      text-align: center; max-width: 150px; width: max-content">
        {{ node.description }}
      </div>
    </div>
    


  </div>
</template>

<script>
export default {


  props: {
    tab: Object,
    node: Object,
  },



  computed: {

    selected: {
      get() { return this.tab.nodes.selected[this.node.id] },
      set(value) { return this.$set(this.tab.nodes.selected, this.node.id, value) },
    },

  },



  methods: {

    onMouseDown(event) {
      let mousePos = _app.getMousePos(this.tab.id, event)


      if (event.button === 0)
        event.stopPropagation()
      else
        return

      
      if (!event.ctrlKey && !this.selected)
        this.tab.nodes.selected = []


      if (event.ctrlKey && this.selected) {
        this.selected = false

        this.tab.nodes.active = null
      } else {
        this.selected = true

        this.tab.nodes.active = this.node
      }


      this.tab.nodes.dragPos = Object.create(mousePos)
    },

  },



}
</script>

<style>

</style>