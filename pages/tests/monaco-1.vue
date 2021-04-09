<template>
  <div>
    <MonacoEditor
      class="editor" v-model="code" language="sql" theme="vs-dark"
      :options="{
        automaticLayout: true,
        lineNumbers: 'off',
        minimap: { enabled: false },
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
      }"
      style="width: 100%; height: 100vh; border: 1px solid grey"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: 'const noop = () => {}'
    }
  }
}
</script>

<style>

</style>