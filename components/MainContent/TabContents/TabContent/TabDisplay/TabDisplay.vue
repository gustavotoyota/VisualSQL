<template>
  <div :id="`display-${tab.id}`"
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



  mounted() {
    if (!this.tab.initialized) {
      this.$store.commit('fitScreen')

      this.tab.initialized = true
    }
  },
  

}
</script>

<style>

</style>