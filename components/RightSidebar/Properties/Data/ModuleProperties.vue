<template>
  <div v-if="node.type === 'module'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Referenced module:
      </div>

      <v-autocomplete class="mt-1" dense solo
      :items="moduleNames" v-model="node.props.moduleName">
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


    ..._vuex.mapFields([
      'project.modules',
    ]),
    


    moduleNames() {
      let moduleNames = []

      for (let module of this.modules)
        moduleNames.push(module.name)

      return moduleNames
    },


  },

}
</script>

<style>

</style>