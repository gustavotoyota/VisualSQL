<template>
  <ToolbarButton tooltip="Open project" @click="onClick">
    <v-icon dense>mdi-folder-open</v-icon>
  </ToolbarButton>
</template>

<script>
export default {


  methods: {

    async onClick(event) {
      try {
        // Get file handle

        _app.fileHandle = (await showOpenFilePicker({
          types: [{
            description: 'Visual SQL files',
            accept: { 'application/json': ['.vsql'] },
          }],
        }))[0]



        // Get file

        const file = await _app.fileHandle.getFile()



        // Read file

        const fileReader = new FileReader()
        
        fileReader.onload = (event) => {
          // Load project

          this.$state.project = JSON.parse(event.target.result)



          // Rerender tabs

          this.$state.tabs.rerender++



          // Initialize undo/redo states

          for (const tab of this.$state.project.tabs)
            this.$store.commit('saveState', tab)
        }

        fileReader.readAsText(file)
      } catch {
      }
    },

  },


}
</script>

<style>

</style>