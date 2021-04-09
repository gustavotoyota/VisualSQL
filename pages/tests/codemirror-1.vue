<template>
  <div>
    <client-only placeholder="Codemirror Loading...">
      <codemirror
        v-model="code"
        :options="{
          tabSize: 2,
          extraKeys: { 'Ctrl-Space' : 'autocomplete' },
          mode: 'text/x-mysql',
          theme: 'base16-dark',
          lineWrapping: true,
        }"/>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      code: ''
    }
  }
}
</script>

<style>
  .CodeMirror {
    font-size: 14px;
  }
</style>