<template>

  <div v-if="node.type === 'limit'">


    <PropCodeEditor

    class="mx-5 mt-5"
    :height="60"

    label="Limit (LIMIT/FETCH/TOP...)"
    v-model="node.props.limit.value"

    :columns="$getters.currentDatabase.generateTree(module, node).columns"/>



    <PropCodeEditor

    class="mx-5 mt-5"
    :height="60"

    label="Offset (OFFSET)"
    v-model="node.props.offset.value"

    :columns="$getters.currentDatabase.generateTree(module, node).columns"/>


  </div>

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