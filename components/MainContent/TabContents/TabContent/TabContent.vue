<template>
  <v-tab-item class="fill-height">

    <div class="fill-height d-flex flex-column">


      <TabToolbar :tab="tab" :module="module">
      </TabToolbar>


      <TabDisplay :tab="tab" :module="module">
      </TabDisplay>


    </div>

  </v-tab-item>
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