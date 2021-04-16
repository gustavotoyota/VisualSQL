<template>
  <div class="pa-5">
    <v-list dense>

      <draggable v-model="modules" tag="v-list-item-group">

        <v-list-item v-for="item in modules" :key="item.id">
          <v-list-item-icon>
            <v-icon>mdi-view-module</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </draggable>

    </v-list>
  </div>
</template>

<script>
export default {


  mounted() {
    this.$store.commit('resetProject')
    
    this.$store.commit('createModule', 'kjhashdjsadd')
    this.$store.commit('createModule', '123asfdas')
  },



  computed: {
    ..._vuex.mapFields([
      'modules',
    ]),
  },


}
</script>

<style>

</style>