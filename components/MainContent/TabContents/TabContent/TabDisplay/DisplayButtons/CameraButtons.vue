<template>
  <div style="position: absolute; right: 16px; top: 16px">
    
    <div style="margin-top: 1px">

      <DisplayButton tooltip="Reset zoom"
      @click="module.camera.zoom = 1">
        <v-icon>mdi-magnify-remove-outline</v-icon>
      </DisplayButton>

    </div>

    <div style="margin-top: 1px">

      <DisplayButton tooltip="Fit to screen"
      @click="$commit('fitToScreen')">
        <v-icon>mdi-image-filter-center-focus-weak</v-icon>
      </DisplayButton>
      
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