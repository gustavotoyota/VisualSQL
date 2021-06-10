<template>
  <ToolbarButton tooltip="Save project" @click="onClick">
    <v-icon dense>mdi-content-save</v-icon>
  </ToolbarButton>
</template>

<script>
export default {


  methods: {

    async onClick(event) {
      try {
        _app.fileHandle = await showSaveFilePicker({
          types: [{
            description: 'Visual SQL files',
            accept: { 'application/json': ['.vsql'] },
          }],
        })

        _app.saveProject()
      } catch {
      }
    },

  },


}
</script>

<style>

</style>