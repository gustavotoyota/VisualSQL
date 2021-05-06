<template>
  <MonacoEditor
    class="editor" language="sql"
    style="border-radius: 5px; overflow: hidden"
    v-model="inputValue"
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
      renderLineHighlight: 'none',
    }"/>
</template>

<script>
export default {


  props: {
    value: String,
  },



  computed: {
    
    inputValue: {
      get() { return this.value },
      set(event) { this.$emit('input', event) },
    },
    
  },


}
</script>

<style>
  .editor {
    border: 1px solid #303030;
  }

  .monaco-editor-background {
    background-color: #101010 !important;
  }

  .margin {
    background-color: #101010 !important;
  }
</style>