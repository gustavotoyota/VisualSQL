<template>
  <div :id="`display-${tab.id}`" class="display"
  style="position: relative; flex: 1; overflow: hidden">


    <DisplayView :tab="tab" :module="module"/>

    <DisplayButtons :tab="tab" :module="module"/>


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