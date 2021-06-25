<template>


  <PropCodeEditor

  v-if="node.type === 'filter'"

  class="mx-5 mt-5"

  label="Filter condition (WHERE)"
  v-model="node.props.condition"

  :columns="$getters.currentDatabase.generateTree(module, node).columns"/>
  
  
</template>

<script>
export default {

  props: {
    module: Object,
    node: Object,
  },

}
</script>

<style>

</style>