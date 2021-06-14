<template>


  <PropCodeEditor

  v-if="node.type === 'filter'"

  class="mx-5 mt-5"

  :columns="$app.columnTracking.processNode($getters.currentModule, node)"

  label="Filter condition (WHERE)"
  v-model="node.props.condition"/>
  
  
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