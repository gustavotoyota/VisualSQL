<template>
  <v-app>
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        max-width="300"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="red lighten-2"
            dark
            v-bind="attrs"
            v-on="on"
          >
            Click Me
          </v-btn>
        </template>

        <v-card>
          <v-card-title>
            Table
          </v-card-title>

          <v-card-text>
            Columns:
            
            <MonacoEditor
              class="mt-1 editor" v-model="code" language="sql"
              :options="{
                theme: 'vs-dark',
                tabSize: 2,
                automaticLayout: true,
                lineNumbers: 'off',
                minimap: { enabled: false },
                padding: { top: 2, bottom: 2 },
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 5,
                lineNumbersMinChars: 0,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                quickSuggestions: false,
              }"
              style="height: 200px; border-radius: 5px; overflow: hidden"/>
            <div class="caption">Note: SQL columns or comma-separated</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      code: 'column_1,\ncolumn_2,\ncolumn_3',
      dialog: false,
    }
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