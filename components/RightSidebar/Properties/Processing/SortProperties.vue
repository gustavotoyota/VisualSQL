<template>


  <PropCodeEditor
  
  v-if="node.type === 'sort'"

  class="mx-5 mt-5"

  label="Columns to sort by:"
  v-model="node.props.columns"/>
  
  
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