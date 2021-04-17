<template>
  <svg style="position: absolute"
  left="0" top="0" width="100%" height="100%">
    <svg x="50%" y="50%" style="overflow: visible">
      <g :style="'transform: scale(' + tab.camera.zoom + ') ' +
      'translate(' + -tab.camera.pos.x + 'px, ' + -tab.camera.pos.y + 'px)'">

        
        <DisplayLink
        v-for="link in module.links" :key="link.id"
        :module="module" :link="link"
        @mousedown="deleteLink(link.id)">
        </DisplayLink>
        

        <DisplayLink new-link
        v-if="tab.newLink != null
        && tab.newLink.from != null
        && tab.newLink.to != null"
        :module="module" :link="tab.newLink"/>
        

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

    deleteLink(linkId) {
      this.$store.commit('deleteLink', {
        moduleId: this.module.id,
        linkId: linkId,
      })
    },

  },


}
</script>

<style>
</style>