<template>
  <v-dialog max-width="700" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <v-btn depressed small text
      :disabled="disabled"
      v-on="{ ...dialog }">
        Generate SQL
      </v-btn>

    </template>

    <v-card>

      <v-card-title>Generate SQL</v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text style="height: 420px; display: flex">

        <div style="flex: none; width: 200px">

          <div class="mt-5">
            <div class="body-2 grey--text text--lighten-1">
              Database:
            </div>

            <v-select class="mt-1" dense solo hide-details
            :menu-props="{ top: false, offsetY: true }"
            :items="$app.databases" item-text="text" item-value="value"
            v-model="project.sql.database">
            </v-select>
          </div>

          <v-radio-group hide-details
          v-model="project.sql.uppercaseKeywords">
            <template v-slot:label>
              <div>Keyword case:</div>
            </template>
            
            <v-radio label="Uppercase" :value="true"></v-radio>
            <v-radio label="Lowercase" :value="false"></v-radio>
          </v-radio-group>

          <v-radio-group hide-details
          v-model="project.sql.indentWithSpaces">
            <template v-slot:label>
              <div>Indentation characters:</div>
            </template>
            
            <v-radio label="Spaces" :value="true"></v-radio>
            <v-radio label="Tabs" :value="false"></v-radio>
          </v-radio-group>

          <v-radio-group hide-details
          v-model="project.sql.indentSize">
            <template v-slot:label>
              <div>Indentation size:</div>
            </template>
            
            <v-radio label="2 spaces" :value="2"></v-radio>
            <v-radio label="4 spaces" :value="4"></v-radio>
          </v-radio-group>

        </div>

        <div class="pl-6 pt-6 pb-1" style="flex: 1; display: flex">

          <MonacoEditor
            class="editor" v-model="sql" language="sql"
            style="flex: 1; width: 0; border-radius: 5px; overflow: hidden"
            :options="{
              theme: 'vs-dark',
              automaticLayout: true,
              lineNumbers: 'off',
              minimap: { enabled: false },
              padding: { top: 2, bottom: 2 },
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 3,
              lineNumbersMinChars: 0,
              scrollBeyondLastLine: false,
              quickSuggestions: false,
            }"

            @editorDidMount="editorDidMount"/>

        </div>

      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        
        <v-spacer></v-spacer>

        <v-btn color="blue darken-1" text
        @click="active = false">
          Ok
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>
</template>

<script>
let monacoEditor = null


export default {


  props: {
    module: Object,
    disabled: Boolean,
  },



  data() {
    return {
      
      active: false,

      sql: '',
      
    }
  },



  computed: {
    
    ..._vuex.mapFields([
      'project',
    ]),

  },



  methods: {

    editorDidMount(editor) {
      monacoEditor = editor
    },



    generateSQL() {
      if (monacoEditor != null)
        monacoEditor.getModel().updateOptions({ tabSize: this.project.sql.indentSize })




      let treeObj = _app.sqlGeneration[this.project.sql.database].generateTree(
        this.$store, this.module, this.$store.getters.activeNode)
      
      if (treeObj.error != null)
        return




      let sqlOptions = _app.deepCopy(this.project.sql)

      let sqlObj = _app.sqlGeneration[this.project.sql.database].
        generateSQL(treeObj, sqlOptions)

      this.sql = sqlObj.sql
    },

  },



  watch: {

    active(value) {
      if (!value)
        return

      this.generateSQL()
    },

    'project.sql': {
      handler(value) {
        if (!this.active)
          return

        this.generateSQL()
      },

      deep: true,
    }

  },



}
</script>

<style>

</style>