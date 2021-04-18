<template>
  <v-dialog max-width="320" v-model="active">


    <template v-slot:activator="{ on, attrs }">

      <v-list-item v-bind="attrs" v-on="on">

        <v-list-item-icon style="margin-right: 10px">
            <v-icon>mdi-square-edit-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Edit</v-list-item-title>

      </v-list-item>

    </template>



    <v-form ref="form" @submit.prevent="active = false;
    table.name = name; table.columns = columns">
    
      <v-card>

        <v-card-title>
          Edit table
        </v-card-title>

        <v-card-text>

          <v-text-field label="Table name"
          autofocus v-model="name">
          </v-text-field>

          
          <div>
            Columns:
            
            <MonacoEditor
              class="mt-1 editor" v-model="columns" language="sql"
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
              }"
              style="height: 200px; border-radius: 5px; overflow: hidden"/>
              
            <div class="caption">Note: Columns can be SQL or comma-separated</div>
          </div>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn color="primary" text type="submit">
            Ok
          </v-btn>

          <v-btn color="primary" text @click="active = false">
            Cancel
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-form>



  </v-dialog>
</template>

<script>
export default {


  props: {
    table: { type: Object },
  },



  data() {
    return {
      active: false,
      
      name: this.table.name,
      columns: this.table.columns,
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