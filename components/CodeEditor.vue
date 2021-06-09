<template>
  <MonacoEditor language="sql" v-model="inputValue"

  class="editor" style="border: 1px solid #303030"

  @editorDidMount="editorDidMount"

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
let completionItemProvider = null

export default {


  props: {
    value: String,

    options: { type: Object, default: () => ({}) },

    hints: { type: Array, default: () => [] },
  },



  computed: {
    
    inputValue: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
    
  },



  methods: {

    editorDidMount(editor) {
      editor.getModel().getHints = () => this.hints

      if (!completionItemProvider) {
        completionItemProvider = monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems: function (model, position) {
            let items = { suggestions: [] }
            
            for (let hint of model.getHints())
              items.suggestions.push({ label: hint, insertText: hint })
            
            if (model.getHints().length === 0)
              items.suggestions.push({ label: '', insertText: '' })

            return items
          },
        })
      }

      this.$emit('editorDidMount', editor)
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