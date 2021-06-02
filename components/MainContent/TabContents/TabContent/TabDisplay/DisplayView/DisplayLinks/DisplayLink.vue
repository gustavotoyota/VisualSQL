<template>
  <path :class="newLink ? 'newLink' : 'link'"
  :d="getLinkCommand()"
  :cursor="newLink ? '' : 'pointer'"
  :style="active ? 'stroke: rgb(3, 155, 229)' : (selected ? 'stroke: rgb(1, 87, 155)' : '')"
  @pointerdown="$emit('pointerdown', $event)"/>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
    
    link: Object,
    newLink: Boolean,
  },


  computed: {

    selected() {
      return this.tab.links.selected.hasOwnProperty(this.link.id)
    },

    active() {
      return this.tab.links.activeId === this.link.id
    },

  },


  methods: {
    
    getLinkCommand() {
      let srcSocketPos
      if (typeof(this.link.from) === "object")
        srcSocketPos = { ...this.link.from }
      else {
        srcSocketPos = { ...this.module.nodes[this.link.from].pos }
        srcSocketPos.x += _app.socketOffset.x
      }

      let destSocketPos
      if (typeof(this.link.to) === "object")
        destSocketPos = { ...this.link.to }
      else {
        let destNode = this.module.nodes[this.link.to]

        destSocketPos = { ...destNode.pos }
        destSocketPos.x -= _app.socketOffset.x
      
        if (destNode.incomingLinks.length === 2)
          destSocketPos.y += _app.socketOffset.y * (this.link.socket * 2 - 1)
      }

      let controlOffset = Math.abs((destSocketPos.x - srcSocketPos.x) / 2) +
        Math.abs((destSocketPos.y - srcSocketPos.y) / 2)

      return `M ${srcSocketPos.x}, ${srcSocketPos.y}
        C ${srcSocketPos.x + controlOffset}, ${srcSocketPos.y},
        ${destSocketPos.x - controlOffset}, ${destSocketPos.y},
        ${destSocketPos.x}, ${destSocketPos.y}`
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

.newLink {
  pointer-events: none;

  stroke: #b0b0b0;
  stroke-width: 3.5;

  fill: transparent;
}
</style>