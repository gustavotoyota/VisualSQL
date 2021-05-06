<template>
  <div v-if="node.type === 'filter'">


    <div class="mx-5 mt-5">
      <div class="body-2 grey--text text--lighten-1">
        Filter condition:
      </div>

      <CodeEditor class="mt-1" style="height: 100px"
      v-model="node.props.condition"/>
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