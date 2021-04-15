<template>
  <v-list-item @click="$store.commit('createTab', module.id)">


    <v-list-item-icon>
      <v-icon>mdi-cube-outline</v-icon>
    </v-list-item-icon>
        
    <v-list-item-content>
      <v-list-item-title class="body-2"
      style="word-break: break-all; white-space: normal">
        {{ module.name }}
      </v-list-item-title>
    </v-list-item-content>
        

    <DeleteModule :module="module">
    </DeleteModule>


  </v-list-item>
</template>

<script>
export default {


  props: {
    module: { type: Object },
  },


}
</script>

<style>

</style>