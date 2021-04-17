<template>
  <div v-if="node.type === 'module'" class="mt-4">


    <div class="mb-1 body-2 grey--text text--lighten-1">
      Module name:
    </div>


    <v-autocomplete dense solo :items="moduleNames"
    v-model="node.props.moduleName">
    </v-autocomplete>


  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  computed: {


    ..._vuex.mapFields([
      'modules',
    ]),


    ..._vuex.mapGetters([
      'currentModule',
    ]),
    


    moduleNames() {
      let moduleNames = []

      let currentModule = this.currentModule

      for (let module of this.modules)
        if (module.id !== currentModule.id)
          moduleNames.push(module.name)

      return moduleNames
    },


  },

}
</script>

<style>

</style>