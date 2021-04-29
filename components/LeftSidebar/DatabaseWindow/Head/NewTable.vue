<template>
  <v-dialog max-width="320" v-model="active">


    <template v-slot:activator="{ on: dialog }">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn depressed rounded class="ml-2 mt-1" width="32" height="32"
          style="position: relative; left: 8px; min-width: 32px"
          v-on="{ ...dialog, ...tooltip }">
            <v-icon dense>mdi-plus-thick</v-icon>
          </v-btn>

        </template>

        <span>New table</span>

      </v-tooltip>

    </template>



    <v-form ref="form" @submit.prevent="active = false;
    $store.commit('createTable', { name, columns })">
    
      <v-card>

        <v-card-title>
          New table
        </v-card-title>

        <v-card-text>

          <v-text-field label="Table name"
          autofocus v-model="name">
          </v-text-field>

          
          <div>
            Columns:
            
            <MonacoEditor
              class="mt-1 editor" v-model="columns" language="sql"
              style="height: 200px; border-radius: 5px; overflow: hidden"
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


  data() {
    return {
      active: false,
      
      name: '',
      columns: '',
    }
  },


  watch: {

    active(value) {
      if (value) {
        if (this.$refs.form)
          this.$refs.form.reset()

        this.columns = 'column_1 INT NOT NULL,\n' +
          'column_2 VARCHAR(40) UNIQUE,\n' +
          'column_3 DATE NOT NULL,\n' +
          'column_4,\ncolumn_5,\ncolumn_6'
      }
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