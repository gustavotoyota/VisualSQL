<template>
  <div v-if="node.type === 'reduce'" class="mt-4">

    <div class="mb-1 body-2 grey--text text--lighten-1">
      Offset:
    </div>

    <div class="mb-1 body-2 grey--text text--lighten-1">
      Limit:
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