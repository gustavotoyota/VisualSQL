<template>

  <div>

    <div class="body-2 grey--text text--lighten-1">
      {{ label }}
    </div>

    <CodeEditor class="mt-1 editor"
    :style="{ height: `${height}px` }"
    v-model="inputValue"/>

  </div>

</template>

<script>
export default {


  props: {
    label: String,

    height: { type: Number, default: 110 },

    value: String,
  },



  computed: {

    inputValue: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },

  },

  
}
</script>

<style>

</style>