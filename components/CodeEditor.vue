<template>
  <MonacoEditor v-model="inputValue"

  language="sql" class="editor"

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


  
  data() {
    return {
      editor: null,
    }
  },



  computed: {
    
    inputValue: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
    
  },



  methods: {

    editorDidMount(editor) {
      this.editor = editor

      editor.getModel().getHints = () => this.hints

      if (!completionItemProvider) {
        completionItemProvider = monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems: function (model, position) {
            const items = { suggestions: [] }

            const word = model.getWordAtPosition(position)

            const hints = model.getHints()
            
            for (let i = 0; i < hints.length; ++i) {
              const suggestion = { label: hints[i], insertText: hints[i], sortText: i.toString() }

              if (word != null) {
                suggestion.range = {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn,
                }
              }

              items.suggestions.push(suggestion)
            }
            
            if (hints.length === 0)
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
.editor {
  border: 1px solid #404040;
}

.editor /deep/ .monaco-editor-background {
  background-color: #101010 !important;
}

.editor /deep/ .margin {
  background-color: #101010 !important;
}

.editor /deep/ .suggest-widget {
  width: 240px !important;
}



/* IE11 invisible suggestions fix */

.editor /deep/ .monaco-icon-label-container {
  flex-basis: auto;
}
</style>