<template>
  <div>

    <v-btn depressed small text
    :disabled="disabled" @click="generateSQL">
      Generate SQL
    </v-btn>


    <v-dialog max-width="750" v-model="dialog">

      <v-card>

        <v-card-title>Generate SQL</v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text style="height: 420px; display: flex">

          <div style="flex: none; width: 200px">

            <div class="mt-5">
              <div class="body-2 grey--text text--lighten-1">
                Database:
              </div>

              <v-select class="mt-1" dense outlined
              hide-details background-color="#101010"
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

          <div class="pl-5 pt-6 pb-1" style="flex: 1; display: flex">

            <CodeEditor v-model="sql"
            style="flex: 1; width: 0"
            :options="{ readOnly: true }"
            @editorDidMount="editorDidMount"/>

          </div>

        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions>
          
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text
          @click="dialog = false">
            Close
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

  </div>
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
      
      dialog: false,

      sql: '',
      
    }
  },



  computed: {
    
    ..._vuex.mapFields([
      'project',
      'snackbar',
    ]),
    
    ..._vuex.mapGetters([
      'activeNode',
    ]),

  },



  methods: {

    editorDidMount(editor) {
      monacoEditor = editor

      this.updateEditor()
    },



    generateSQL() {
      // Column tracking

      let columnsObj = _app.columnTracking.init(this.$store)
      
      columnsObj.processNode(this.module, this.activeNode)




      // Tree generation

      let treeObj = _app.sql[this.project.sql.database].generateTree(
        this.$store, this.module, this.activeNode, { columnsObj: columnsObj })
      
      if (treeObj.error != null) {
        this.snackbar.text = treeObj.error
        this.snackbar.active = true
        return
      }
      



      // SQL generation

      let sqlOptions = _app.deepCopy(this.project.sql)

      let sqlObj = _app.sql[this.project.sql.database].generateSQL(treeObj, sqlOptions)

      this.sql = sqlObj.sql




      // Show dialog

      this.dialog = true

      if (monacoEditor == null)
        return

      this.updateEditor()
    },



    updateEditor() {
      monacoEditor.getModel().updateOptions({
        tabSize: this.project.sql.indentSize
      })
    },


  },



  watch: {

    'project.sql': {
      handler(value) {
        if (!this.dialog)
          return

        this.updateEditor()
        this.generateSQL()
      },

      deep: true,
    }

  },



}
</script>

<style>

</style>