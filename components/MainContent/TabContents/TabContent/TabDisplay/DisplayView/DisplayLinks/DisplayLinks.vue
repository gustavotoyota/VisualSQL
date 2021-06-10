<template>

  <svg style="position: absolute; pointer-events: none"
  left="0" top="0" width="100%" height="100%">

    <svg x="50%" y="50%" style="overflow: visible">

      <g :transform="'scale(' + module.camera.zoom + ') ' +
      'translate(' + -module.camera.pos.x + ', ' + -module.camera.pos.y + ')'">

        
        <DisplayLink v-for="link in module.links" :key="link.id"
        :tab="tab" :module="module" :link="link"/>
        
        <DisplayNewLink :tab="tab" :module="module"/>
        

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


}
</script>

<style>
</style>