<template>

  <div>

    <div>

      <span style="float: right">

        <PropCodeEditorColumns small :columns="columns"/>

        <PropCodeEditorExpand :title="label" v-model="inputValue"/>

      </span>

      <span class="body-2 grey--text text--lighten-1">
        {{ label }}:
      </span>
      
    </div>

    <CodeEditor style="clear: right" class="mt-1 editor"
    :style="{ height: `${height}px` }"
    v-model="inputValue" :hints="columns || []"/>

  </div>

</template>

<script>
export default {


  props: {
    label: { type: String },

    height: { type: Number, default: 110 },

    value: { type: String },
    
    columns: { type: Array, default: null },
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