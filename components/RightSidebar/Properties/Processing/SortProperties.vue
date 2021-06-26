<template>


  <PropCodeEditor
  
  v-if="node.type === 'sort'"

  class="mx-5 mt-5"

  label="Columns (ORDER BY)"
  v-model="node.props.columns"

  :columns="$getters.getCurrentColumns()"/>
  
  
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