<template>
  <v-menu v-if="columns != null" offset-y left max-height="200">

    <template v-slot:activator="{ on: menu }">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn v-on="{ ...menu, ...tooltip }"
          style="min-width: 0; min-height: 0; padding: 0" :depressed="small"
          :style="small ? 'width: 24px; height: 24px' : 'width: 32px; height: 32px'">
            <v-icon :style="small ? 'font-size: 15px' : ''">mdi-format-list-bulleted</v-icon>
          </v-btn>

        </template>

        <div style="text-align: center">
          <div>Available columns</div>
          <div>(Ctrl + Space)</div>
        </div>

      </v-tooltip>

    </template>
    
    <v-list dense width="400">

      <v-list-item v-if="columns.length === 0">
        <v-list-item-title>No columns available</v-list-item-title>
      </v-list-item>

      <v-list-item
      v-for="(column, index) in columns" :key="index"
      @click="insertColumn(column)">
        <v-list-item-title>{{ column }}</v-list-item-title>
      </v-list-item>
      
    </v-list>

  </v-menu>
  
</template>

<script>
export default {


  props: {
    small: { type: Boolean },
    
    columns: { type: Array },

    editor: { type: Object },
  },



  methods: {

    insertColumn(column) {
      const editor = this.editor

      editor.executeEdits("my-source", [{
        identifier: { major: 1, minor: 1 },
        range: editor.getSelection(),
        text: column,
        forceMoveMarkers: true,
      }])

      editor.focus()
    },

  },


}
</script>

<style scoped>
.v-list {
  padding: 4px !important
}

.v-list-item {
  border-radius: 3px;
  overflow: hidden;

  min-height: 20px;

  padding: 0;
}

.v-list-item__title {
  font-family: Consolas;
  font-size: 14px !important;
  font-weight: normal !important;
  
  color: #e0e0e0;
}
</style>