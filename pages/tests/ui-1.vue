<template>

  <v-app dark>

    <v-app-bar app clipped-left clipped-right dense>

      <v-app-bar-title>
        Visual SQL Tool
      </v-app-bar-title>

      <v-divider vertical inset class="ml-4 mr-2"></v-divider>

      <v-btn depressed small style="min-width: 28px; width: 28px">
        <v-icon dense>mdi-file</v-icon>
      </v-btn>
      <v-btn depressed small style="min-width: 28px; width: 28px">
        <v-icon dense>mdi-folder-open</v-icon>
      </v-btn>
      <v-btn depressed small style="min-width: 28px; width: 28px">
        <v-icon dense>mdi-content-save</v-icon>
      </v-btn>

      <v-divider vertical inset class="mx-2"></v-divider>

      <v-btn depressed small style="min-width: 28px; width: 28px">
        <v-icon dense>mdi-cog</v-icon>
      </v-btn>

      <v-divider vertical inset class="mx-2"></v-divider>

      <v-btn depressed small style="min-width: 28px; width: 28px">
        <v-icon dense>mdi-help-circle</v-icon>
      </v-btn>



      <v-spacer></v-spacer>

    </v-app-bar>
    


    <v-navigation-drawer app width="300" mobile-breakpoint="1000" clipped>

      <div class="d-flex flex-column fill-height">

        <div style="flex: 1 1 auto; height: 0" class="d-flex flex-column">

          <v-toolbar dense style="flex: none">
            <v-toolbar-title>

              <v-icon>mdi-view-dashboard</v-icon>

              <span style="position: relative; top: 2px">Modules</span>

            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn depressed rounded class="mt-1" width="32" height="32"
            style="position: relative; left: 8px; min-width: 32px">
              <v-icon dense>mdi-plus-thick</v-icon>
            </v-btn>
          </v-toolbar>



          <v-list dense style="overflow-y: auto">

            <draggable delay="250" delay-on-touch-only="true">

              <v-hover v-for="(item, key) in modules" :key="key" v-slot="{ hover }">
              
                <v-list-item @click="test('123')">

                  <v-list-item-icon>
                    <v-icon>mdi-view-module</v-icon>
                  </v-list-item-icon>
                  
                  <v-list-item-content>
                    <v-list-item-title class="body-2"
                    style="word-break: break-all; white-space: normal">
                      {{ item.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  
                  <v-btn small rounded v-if="hover" @click.stop="test('234')"
                  style="position: relative; left: 6px; min-width: 28px; width: 28px">
                    <v-icon dense>mdi-trash-can-outline</v-icon>
                  </v-btn>

                </v-list-item>

              </v-hover>

            </draggable>

          </v-list>



        </div>

        <div style="flex: 1 1 auto; height: 0" class="d-flex flex-column">

          <v-toolbar dense style="flex: none">

            <v-toolbar-title>
              <v-icon>mdi-database</v-icon>
              <span style="position: relative; top: 1px">Database</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn depressed rounded class="ml-2 mt-1" width="32" height="32"
            style="position: relative; left: 8px; min-width: 32px">
              <v-icon dense>mdi-plus-thick</v-icon>
            </v-btn>

            <v-btn depressed rounded class="ml-2 mt-1" width="32" height="32"
            style="position: relative; left: 8px; min-width: 32px">
              <v-icon dense>mdi-cog</v-icon>
            </v-btn>

          </v-toolbar>



          <v-list dense style="overflow-y: auto">
            
            <draggable delay="250" delay-on-touch-only="true">

              <v-hover v-for="(item, key) in tables" :key="key" v-slot="{ hover }">
              
                <v-list-item @click="test('123')">

                  <v-list-item-icon>
                    <v-icon>mdi-table</v-icon>
                  </v-list-item-icon>
                  
                  <v-list-item-content>
                    <v-list-item-title class="body-2"
                    style="word-break: break-all; white-space: normal">
                      {{ item.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  
                  <v-btn small rounded v-if="hover" @click.stop="test('234')"
                  style="position: relative; left: 6px; min-width: 28px; width: 28px">
                    <v-icon dense>mdi-trash-can-outline</v-icon>
                  </v-btn>

                </v-list-item>

              </v-hover>

            </draggable>

          </v-list>


        </div>

      </div>

    </v-navigation-drawer>


    

    <v-main>

      <div class="d-flex flex-column fill-height">



        <v-tabs v-model="activeTab" show-arrows style="flex: 0 0 auto" ref="tabs">
          
          <draggable delay="250" delay-on-touch-only="true"
          class="v-slide-group__content v-tabs-bar__content"
          @update="$refs.tabs.callSlider()">

            <v-tab v-for="key in tabs" :key="key" class="text-none">

              {{ modules[key].name }}

              <v-btn plain small rounded
              style="position: relative; left: 6px; min-width: 28px; width: 28px">
                <v-icon dense>mdi-close</v-icon>
              </v-btn>

            </v-tab>
          
          </draggable>

        </v-tabs>



        <v-tabs-items v-model="activeTab" style="flex: 1 1 auto">

          <v-tab-item v-for="key in tabs" :key="key">
            
            <v-toolbar dense>

              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-content-cut</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-content-paste</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-delete</v-icon>
              </v-btn>

              <v-divider vertical inset class="mx-2"></v-divider>

              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-undo</v-icon>
              </v-btn>
              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-redo</v-icon>
              </v-btn>

              <v-divider vertical inset class="mx-2"></v-divider>

              <v-btn depressed small style="min-width: 28px; width: 28px">
                <v-icon dense>mdi-content-duplicate</v-icon>
              </v-btn>

              <v-divider vertical inset class="mx-2"></v-divider>

              <v-btn depressed small>
                Generate SQL
              </v-btn>

            </v-toolbar>
            
            {{ modules[key].name }}
          </v-tab-item>

        </v-tabs-items>




      </div>

    </v-main>



    <v-navigation-drawer app width="300" mobile-breakpoint="1000" clipped right>

      <v-toolbar dense>
        <v-toolbar-title>
          <v-icon>mdi-chart-box</v-icon>
          <span style="position: relative; top: 2px">Properties</span>
        </v-toolbar-title>
      </v-toolbar>
      
      <div class="pa-5">


        <v-text-field dense label="Name">
        </v-text-field>
        

        <v-textarea dense rows="2" label="Description">
        </v-textarea>



        <v-radio-group>
          <template v-slot:label>
            <div>Join type:</div>
          </template>
          
          <v-radio label="Inner join"></v-radio>
          <v-radio label="Left join"></v-radio>
          <v-radio label="Right join"></v-radio>
          <v-radio label="Full join"></v-radio>
          <v-radio label="Cross join"></v-radio>
        </v-radio-group>



        <div class="body-2 grey--text text--lighten-1">Code:</div>
        <div class="mb-1"></div>
        <MonacoEditor
          class="editor" v-model="code" language="sql"
          :options="{
            theme: 'vs-dark',
            automaticLayout: true,
            lineNumbers: 'off',
            minimap: { enabled: false },
            padding: { top: 5, bottom: 5 },
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 4,
            lineNumbersMinChars: 0,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            quickSuggestions: false,
          }"
          style="height: 150px; border-radius: 5px; overflow: hidden"/>


      </div>

    </v-navigation-drawer>



    <v-footer app class="caption text-right">
      Gustavo Toyota
    </v-footer>

  </v-app>

</template>

<script>
export default {

  
  head: {
    title: 'Visual SQL Tool',
  },


  data() {
    return {
      modules: {
        0: { name: 'module_1' },
        1: { name: 'module_2' },
        2: { name: 'module_3' },
        3: { name: 'module_4' },
      },
      tables: {
        0: { name: 'table_1' },
        1: { name: 'table_2' },
      },
      tabs: [0, 1],
      activeTab: null,
      code: 'max(age) as max_age',
    }
  },


  methods: {
    test(asd) {
      alert(asd)
    }
  },



}
</script>

<style>

</style>