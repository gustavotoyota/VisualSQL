<template>
  <svg style="position: absolute"
  left="0" top="0" width="100%" height="100%">
    <svg x="50%" y="50%" style="overflow: visible">
      <g :style="'transform: scale(' + tab.camera.zoom + ') ' +
      'translate(' + -tab.camera.pos.x + 'px, ' + -tab.camera.pos.y + 'px)'">
        
        <path v-for="link in module.links" :key="link.id" cursor="pointer"
        :d="getLinkCommand(link)"
        stroke="gray" stroke-width="3.5" fill="transparent"/>

      </g>
    </svg>
  </svg>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
  },


  methods: {

    getLinkCommand(link) {
      let srcNode = this.module.nodes[link.from]
      let destNode = this.module.nodes[link.to]

      let srcSocketPos = { x: srcNode.pos.x + _app.socketOffset.x, y: srcNode.pos.y }
      let destSocketPos = { x: destNode.pos.x - _app.socketOffset.x, y: destNode.pos.y }

      let amount = Math.abs((destSocketPos.x - srcSocketPos.x) / 2) +
        Math.abs((destSocketPos.y - srcSocketPos.y) / 2)

      return `M ${srcSocketPos.x}, ${srcNode.pos.y}
        C ${srcSocketPos.x + amount}, ${srcNode.pos.y},
        ${destSocketPos.x - amount}, ${destNode.pos.y},
        ${destSocketPos.x}, ${destNode.pos.y}`
    },

  },


}
</script>

<style>

</style>