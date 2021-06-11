<template>

  <div>

    <div>

      <span style="float: right">

        <v-btn style="min-width: 0; width: 24px; min-height: 0; height: 24px; padding: 0">
          <v-icon style="font-size: 15px">mdi-format-list-bulleted</v-icon>
        </v-btn>

        <PropCodeEditorExpand :title="label" v-model="inputValue"/>

      </span>

      <span class="body-2 grey--text text--lighten-1">
        {{ label }}:
      </span>
      
    </div>

    <CodeEditor style="clear: right" class="mt-1 editor"
    :style="{ height: `${height}px` }"
    v-model="inputValue"/>

  </div>

</template>

<script>
export default {


  props: {
    label: String,

    height: { type: Number, default: 110 },

    value: String,
  },



  computed: {

    inputValue: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },

  },

  
}
</script>

<style>

</style>