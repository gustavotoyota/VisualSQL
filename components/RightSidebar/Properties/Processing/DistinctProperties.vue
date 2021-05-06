<template>


  <PropCodeEditor
  
  v-if="node.type === 'distinct'"

  class="mx-5 mt-5"

  label="Columns with distinct rows:"
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