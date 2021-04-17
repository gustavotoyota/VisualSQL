<template>
  <div v-if="node.type === 'transform'">


    <div class="mt-4">
      <div class="mb-1 body-2 grey--text text--lighten-1">
        Group columns:
      </div>

      <MonacoEditor
        class="mt-1 editor" v-model="node.props.outputColumns" language="sql"
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



    <div class="mt-4">
      <div class="mb-1 body-2 grey--text text--lighten-1">
        Filter condition:
      </div>

      <MonacoEditor
        class="mt-1 editor" v-model="node.props.outputColumns" language="sql"
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




    <div class="mt-4">
      <div class="mb-1 body-2 grey--text text--lighten-1">
        Output columns:
      </div>

      <MonacoEditor
        class="mt-1 editor" v-model="node.props.outputColumns" language="sql"
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