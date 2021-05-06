<template>
  <div v-if="node.type === 'sql'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        SQL code:
      </div>

      <CodeEditor class="mt-1 editor" style="height: 150px"
      v-model="node.props.sql"/>
    </div>
    

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