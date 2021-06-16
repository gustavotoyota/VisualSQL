<template>

  <div>

    <div>

      <span style="float: right">

        <PropCodeEditorColumns small :columns="columns"/>

        <PropCodeEditorExpand :title="label"
        v-model="inputValue" :columns="columns"/>

      </span>

      <span class="body-2 grey--text text--lighten-1">
        {{ label }}:
      </span>
      
    </div>

    <CodeEditor ref="editor" class="mt-1" :style="{ height: `${height}px` }"
    style="clear: right; border: 1px solid #505050"
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

<style scoped>

</style>