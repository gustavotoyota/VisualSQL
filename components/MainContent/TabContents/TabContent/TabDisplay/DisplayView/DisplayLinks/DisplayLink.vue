<template>
  <path class="link" cursor="pointer" :d="linkCommand"
  :style="active ? 'stroke: rgb(3, 155, 229)' : (selected ? 'stroke: rgb(1, 87, 155)' : '')"
  @pointerdown="onPointerDown"/>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
    
    link: Object,
  },


  computed: {

    selected() {
      return this.link.id in this.tab.links.selected
    },

    active() {
      return this.tab.links.activeId === this.link.id
    },
    

    
    linkCommand() {
      let srcSocketPos
      if (typeof(this.link.from) === "object")
        srcSocketPos = $utils.shallowCopy(this.link.from)
      else {
        srcSocketPos = $utils.shallowCopy(this.module.data.nodes.map[this.link.from].pos)
        srcSocketPos.x += $app.socketOffset.x
      }

      let destSocketPos
      if (typeof(this.link.to) === "object")
        destSocketPos = $utils.shallowCopy(this.link.to)
      else {
        const destNode = this.module.data.nodes.map[this.link.to]

        destSocketPos = $utils.shallowCopy(destNode.pos)
        destSocketPos.x -= $app.socketOffset.x
      
        if (destNode.incomingLinks.length === 2)
          destSocketPos.y += $app.socketOffset.y * (this.link.socket * 2 - 1)
      }

      const controlOffset = Math.abs((destSocketPos.x - srcSocketPos.x) / 2) +
        Math.abs((destSocketPos.y - srcSocketPos.y) / 2)

      return `M ${srcSocketPos.x}, ${srcSocketPos.y}
        C ${srcSocketPos.x + controlOffset}, ${srcSocketPos.y},
        ${destSocketPos.x - controlOffset}, ${destSocketPos.y},
        ${destSocketPos.x}, ${destSocketPos.y}`
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
        this.tab.nodes.activeId = null


        
      if (event.ctrlKey && this.selected) {
        $delete(this.tab.links.selected, this.link.id)
        
        this.tab.links.activeId = null
      } else {
        $set(this.tab.links.selected, this.link.id, true)
        
        this.tab.links.activeId = this.link.id
      }
    },

  },
  

}
</script>

<style scoped>
.link {
  pointer-events: visibleStroke;

  stroke: #707070;
  stroke-width: 3.5;

  fill: transparent;
}
.link:hover {
  stroke: #b0b0b0;
}
</style>