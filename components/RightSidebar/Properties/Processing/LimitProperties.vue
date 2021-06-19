<template>
  <div v-if="node.type === 'limit'">


    <PropCodeEditor

    class="mx-5 mt-5"
    :height="60"

    label="Offset (OFFSET)"
    v-model="node.props.offset"

    :columns="$app.columnTracking.getInputColumns($getters.currentModule, node)"/>



    <PropCodeEditor

    class="mx-5 mt-5"
    :height="60"

    label="Limit (LIMIT/FETCH/TOP...)"
    v-model="node.props.limit"

    :columns="$app.columnTracking.getInputColumns($getters.currentModule, node)"/>


  </div>
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