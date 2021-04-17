<template>
  <div v-if="node.type === 'pivot'" class="mt-4">

    <div class="mb-1 body-2 grey--text text--lighten-1">
      Pivot columns:
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