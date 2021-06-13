<template>
  <v-tab class="text-none">

    {{ module.name }}

    <v-btn small rounded text @click="closeTab"
    style="position: relative; left: 6px; min-width: 0; width: 28px; padding: 0">
      <v-icon dense>mdi-close</v-icon>
    </v-btn>

  </v-tab>
</template>

<script>
export default {


  props: {
    tab: { type: Object },
    module: { type: Object },
  },



  methods: {
    

    closeTab() {
      this.$store.commit('closeTab', this.tab.id)
    },


  },



}
</script>

<style>

</style>