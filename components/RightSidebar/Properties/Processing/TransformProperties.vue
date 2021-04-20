<template>
  <div v-if="node.type === 'transform'">

    
    <div class="mx-5 mt-5">
      <v-switch hide-details label="Group rows"
      v-model="node.props.group">
      </v-switch>
    </div>


    <v-expand-transition>
      <div v-if="node.props.group">
        <div class="mx-5 mt-5">
          <div class="body-2 grey--text text--lighten-1">
            Columns to group by:
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
        


        <div class="mx-5 mt-5" v-if="node.props.group">
          <div class="body-2 grey--text text--lighten-1">
            Grouped rows filter condition:
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
    </v-expand-transition>




    <v-divider class="mt-6"></v-divider>




    <div class="mx-5 my-5">
      <div class="body-2 grey--text text--lighten-1">
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