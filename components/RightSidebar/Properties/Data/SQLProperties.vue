<template>


  <PropCodeEditor
  
  v-if="node.type === 'sql'"

  class="mx-5 mt-5"

  label="SQL code:"
  v-model="node.props.sql"
  height="170"/>


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