<template>
  <div v-if="node.type === 'node'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Referenced node:
      </div>


      <v-autocomplete class="mt-1" dense solo
      :items="nodeNames" v-model="node.props.nodeName">
      </v-autocomplete>
    </div>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  computed: {
    
    
    nodeNames() {
      let nodeNames = []

      for (let module of this.$state.project.modules)
        for (let node of Object.values(module.nodes))
          if (node.props.name !== '')
            nodeNames.push(module.name + '.' + node.props.name)

      return nodeNames
    },


  },


}
</script>

<style>

</style>