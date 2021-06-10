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

    link() { return this.$state.linking.newLink },
    
    
    linkCommand() {
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
.new-link {
  pointer-events: none;

  stroke: #b0b0b0;
  stroke-width: 3.5;

  fill: transparent;
}
</style>