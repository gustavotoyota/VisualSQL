<template>
  <div v-if="$app.nodeTypes[node.type].category === 'joins'" class="mt-4">

    <v-radio-group v-model="node.type">
      <template v-slot:label>
        <div>Join type:</div>
      </template>
      
      <v-radio label="Inner join" value="inner-join"></v-radio>
      <v-radio label="Left join" value="left-join"></v-radio>
      <v-radio label="Right join" value="right-join"></v-radio>
      <v-radio label="Full join" value="full-join"></v-radio>
      <v-radio label="Cross join" value="cross-join"></v-radio>
    </v-radio-group>



    <div class="mb-1 body-2 grey--text text--lighten-1">
      Join condition:
    </div>

    <MonacoEditor
      class="mt-1 editor" v-model="node.props.condition" language="sql"
      style="height: 150px; border-radius: 5px; overflow: hidden"
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