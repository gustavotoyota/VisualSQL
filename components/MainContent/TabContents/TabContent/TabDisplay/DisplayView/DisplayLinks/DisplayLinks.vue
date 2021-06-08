<template>
  <svg style="position: absolute; pointer-events: none"
  left="0" top="0" width="100%" height="100%">
    <svg x="50%" y="50%" style="overflow: visible">
      <g :style="'transform: scale(' + tab.camera.zoom + ') ' +
      'translate(' + -tab.camera.pos.x + 'px, ' + -tab.camera.pos.y + 'px)'">

        
        <DisplayLink :tab="tab"
        v-for="link in module.links" :key="link.id"
        :module="module" :link="link"
        @pointerdown="selectLink(link, $event)"/>
        

        <DisplayLink new-link :tab="tab"
        v-if="$state.linking.newLink != null
        && $state.linking.newLink.from != null
        && $state.linking.newLink.to != null"
        :module="module" :link="$state.linking.newLink"/>
        

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

    isLinkSelected(link) {
      return link.id in this.tab.links.selected
    },


    selectLink(link, event) {
      if (event.button === 0)
        event.stopPropagation()
      else
        return



      if (!event.ctrlKey && !this.isLinkSelected(link))
        this.$store.commit('clearSelection')
      else
        this.tab.nodes.activeId = null


        
      if (event.ctrlKey && this.isLinkSelected(link)) {
        this.$delete(this.tab.links.selected, link.id)
        
        this.tab.links.activeId = null
      } else {
        this.$set(this.tab.links.selected, link.id, true)
        
        this.tab.links.activeId = link.id
      }
    },

  },


}
</script>

<style>
</style>