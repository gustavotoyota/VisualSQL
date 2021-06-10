<template>
  <div>

    <NodeButtons :tab="tab" :module="module"/>

    <CameraButtons :tab="tab" :module="module"/>
    
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