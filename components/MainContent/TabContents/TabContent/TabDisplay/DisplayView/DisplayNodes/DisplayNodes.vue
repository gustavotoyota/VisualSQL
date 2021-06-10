<template>

  <!-- Centralizer -->

  <div style="position: absolute; left: 50%; top: 50%">



    <!-- Viewbox -->

    <div style="width: 0; height: 0"
    :style="{ transform: 'scale(' + module.camera.zoom +') ' +
    'translate(' + -module.camera.pos.x + 'px, ' + -module.camera.pos.y + 'px)' }">


      <DisplayAlias
      v-for="link in module.links" :key="`link_${link.id}`"
      :module="module" :link="link">
      </DisplayAlias>


      <DisplayNode
      v-for="node in module.nodes" :key="`node_${node.id}`"
      :node="node" :tab="tab">
      </DisplayNode>


    </div>



  </div>

</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
  },

}
</script>

<style>

</style>