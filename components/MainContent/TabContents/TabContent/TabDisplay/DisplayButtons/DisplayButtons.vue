<template>
  <div>


    <NodeButtons :tab="tab">
    </NodeButtons>


    <CameraButtons :tab="tab" :module="module">
    </CameraButtons>
    
    
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