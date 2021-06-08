<template>
  <MonacoEditor language="sql" v-model="inputValue" class="editor"

  style="border: 1px solid #303030"

  @editorDidMount="$emit('editorDidMount', $event)"

  :options="{
    theme: 'vs-dark',

    tabSize: 2,

    automaticLayout: true,
    padding: { top: 2, bottom: 2 },

    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 3,
    
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    quickSuggestions: false,

    ...options,
  }"/>
</template>

<script>
export default {


  props: {
    value: String,

    options: { type: Object, default: () => ({}) },
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
.editor /deep/ .monaco-editor-background {
  background-color: #101010 !important;
}

.editor /deep/ .margin {
  background-color: #101010 !important;
}
</style>