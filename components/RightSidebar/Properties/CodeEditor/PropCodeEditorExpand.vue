<template>

  <v-dialog max-width="700" eager v-model="dialog">

    <template v-slot:activator="{ on: dialog }">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn v-on="{ ...dialog, ...tooltip }" depressed
          style="min-width: 0; width: 24px; min-height: 0; height: 24px; padding: 0">
            <v-icon style="font-size: 15px">mdi-arrow-expand</v-icon>
          </v-btn>

        </template>

        <span>Expand</span>

      </v-tooltip>

    </template>

    
    

    <v-card>

      <v-card-title>
        
        {{ title }}

        <v-spacer/>

        <PropCodeEditorColumns :columns="columns"/>

      </v-card-title>
      
      <v-divider/>
      
      <v-card-text style="height: 480px; display: flex">

        <CodeEditor v-model="inputValue"
        :key="`sql-${dialog}`" class="mt-5"
        style="flex: 1; width: 0" :hints="columns"/>

      </v-card-text>
      
      <v-divider/>
      
      <v-card-actions>
        
        <v-spacer></v-spacer>

        <v-btn color="blue darken-1" text
        @click="dialog = false">
          Close
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</template>

<script>
export default {


  props: {
    title: { type: String },

    value: { type: String },

    columns: { type: Array },
  },



  computed: {
    
    inputValue: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
    
  },



  data() {
    return {
      dialog: false,
    }
  },


}
</script>

<style>

</style>