<template>
  <div v-if="node.type === 'sort'" class="mt-4">

    <div class="mb-1 body-2 grey--text text--lighten-1">
      Columns:
    </div>

    <MonacoEditor
      class="mt-1 editor" v-model="node.props.columns" language="sql"
      style="height: 100px; border-radius: 5px; overflow: hidden"
      :options="{
        theme: 'vs-dark',
        tabSize: 2,
        automaticLayout: true,
        lineNumbers: 'off',
        minimap: { enabled: false },
        padding: { top: 2, bottom: 2 },
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 3,
        lineNumbersMinChars: 0,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        quickSuggestions: false,
      }"/>

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