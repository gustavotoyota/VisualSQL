<template>
  <div v-if="node.type === 'node'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Referenced node (FROM):
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
    module: Object,
    node: Object,
  },



  computed: {
    
    
    nodeNames() {
      const nodeNames = []

      for (const module of $state.project.modules.list)
        for (const node of Object.values(module.data.nodes.map))
          if (node.props.name !== '')
            nodeNames.push(module.name + '.' + node.props.name)

      return nodeNames
    },


  },


}
</script>

<style>

</style>