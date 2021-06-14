<template>


  <PropCodeEditor

  v-if="node.type === 'filter'"

  class="mx-5 mt-5"

  label="Filter condition (WHERE)"
  v-model="node.props.condition"

  :columns="$app.columnTracking.getInputColumns($getters.currentModule, node)"/>
  
  
</template>

<script>
export default {

  props: {
    node: Object,
  },

}
</script>

<style>

</style>