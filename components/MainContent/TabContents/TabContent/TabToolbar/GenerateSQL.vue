<template>
  <div>

    <v-btn depressed small text class="px-2"
    :disabled="disabled" @click="generateSQL">
      Generate SQL
    </v-btn>


    <v-dialog max-width="750" v-model="dialog">

      <v-card>

        <v-card-title>Generate SQL</v-card-title>
        
        <v-divider/>
        
        <v-card-text style="height: 420px; display: flex">

          <div style="flex: none; width: 200px">

            <div class="mt-5">
              <div class="body-2 grey--text text--lighten-1">
                Database:
              </div>

              <v-select class="mt-1" dense outlined
              hide-details background-color="#101010"
              :menu-props="{ top: false, offsetY: true }"
              :items="$app.databases.items" item-text="text" item-value="value"
              v-model="$state.project.sql.database">
              </v-select>
            </div>

            <v-radio-group hide-details
            v-model="$state.project.sql.uppercaseKeywords">
              <template v-slot:label>
                <div>Keyword case:</div>
              </template>
              
              <v-radio label="Uppercase" :value="true"></v-radio>
              <v-radio label="Lowercase" :value="false"></v-radio>
            </v-radio-group>

            <v-radio-group hide-details
            v-model="$state.project.sql.indentWithSpaces">
              <template v-slot:label>
                <div>Indentation characters:</div>
              </template>
              
              <v-radio label="Spaces" :value="true"></v-radio>
              <v-radio label="Tabs" :value="false"></v-radio>
            </v-radio-group>

            <v-radio-group hide-details
            v-model="$state.project.sql.indentSize">
              <template v-slot:label>
                <div>Indentation size:</div>
              </template>
              
              <v-radio label="2 spaces" :value="2"></v-radio>
              <v-radio label="4 spaces" :value="4"></v-radio>
            </v-radio-group>

          </div>

          <div class="pl-5 pt-6 pb-1" style="flex: 1; display: flex">

            <CodeEditor v-model="sql"
            :key="`sql-${dialog}`"
            style="flex: 1; width: 0"
            :options="{ readOnly: true }"
            @editorDidMount="editorDidMount"/>

          </div>

        </v-card-text>
        
        <v-divider/>
        
        <v-card-actions>
          
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text
          @click="copySQL">
            Copy
          </v-btn>

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
    tab: Object,

    disabled: Boolean,
  },



  data() {
    return {
      
      dialog: false,

      sql: '',
      
    }
  },



  methods: {

    editorDidMount(editor) {
      monacoEditor = editor

      this.updateEditor()
    },



    generateSQL() {
      // Tree generation

      let treeObj = $app.databases.data[this.$state.project.sql.database].
        generateTree(this.module, this.$getters.activeNode)
      
      if (treeObj.error.message != null) {
        this.$store.commit('showSnackbar', {
          text: treeObj.error.message,
          color: 'red',
          timeout: 4000,
        })

        this.$store.commit('clearSelection')
        this.tab.nodes.selected[treeObj.error.node.id] = true
        this.tab.nodes.activeId = treeObj.error.node.id

        return
      }
      



      // SQL generation

      let sqlOptions = $utils.deepCopy(this.$state.project.sql)

      let sqlObj = $app.databases.data[this.$state.project.sql.database].
        generateSQL(treeObj, sqlOptions)

      this.sql = sqlObj.sql




      // Show dialog

      this.dialog = true

      if (monacoEditor == null)
        return

      this.updateEditor()
    },



    updateEditor() {
      monacoEditor.getModel().updateOptions({
        tabSize: this.$state.project.sql.indentSize
      })
    },



    copySQL() {
      $utils.writeToClipboard(this.sql)

      this.$store.commit('showSnackbar', {
        text: 'Copied generated SQL',
        color: 'green',
        timeout: 2000,
      })
    },


  },



  watch: {

    '$state.project.sql': {
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