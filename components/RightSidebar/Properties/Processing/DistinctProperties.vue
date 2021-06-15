<template>

  <div>

    <PropCodeEditor
    
    v-if="node.type === 'distinct' && $app.databases.data[$state.project.sql.database].infos.distinctOn"

    class="mx-5 mt-5"

    label="Columns (DISTINCT ON)"
    v-model="node.props.columns"

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