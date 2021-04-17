<template>
  <div v-if="node.type === 'node'" class="mt-4">


    <div class="mb-1 body-2 grey--text text--lighten-1">
      Referenced node:
    </div>


    <v-autocomplete dense solo :items="nodeNames"
    v-model="node.props.nodeName">
    </v-autocomplete>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  computed: {


    ..._vuex.mapGetters([
      'currentModule',
    ]),
    


    nodeNames() {
      let nodeNames = []

      for (let node of Object.values(this.currentModule.nodes))
        if (node.name !== '')
          nodeNames.push(node.name)

      return nodeNames
    },


  },


}
</script>

<style>

</style>