<template>
  <path class="new-link" :d="linkCommand"
  
  v-if="tab === $getters.currentTab
  && $state.linking.active
  && $state.linking.newLink.from != null
  && $state.linking.newLink.to != null"/>
</template>

<script>
export default {


  props: {
    tab: Object,
    module: Object,
  },


  computed: {

    link() { return $state.linking.newLink },
    
    
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


}
</script>

<style scoped>
.new-link {
  pointer-events: none;

  stroke: #b0b0b0;
  stroke-width: 3.5;

  fill: transparent;
}
</style>