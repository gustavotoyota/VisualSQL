<template>

  <div>

    <div>

      <span style="float: right">

        <PropCodeEditorColumns small/>

        <PropCodeEditorExpand :title="label" v-model="inputValue"/>

      </span>

      <span class="body-2 grey--text text--lighten-1">
        {{ label }}:
      </span>
      
    </div>

    <CodeEditor style="clear: right" class="mt-1 editor"
    :style="{ height: `${height}px` }"
    v-model="inputValue" :hints="['table1.column1', 'table1.column2', 'table2.column1', 'table2.column2']"/>

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