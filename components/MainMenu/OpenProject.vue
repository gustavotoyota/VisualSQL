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

        this.$state.saving.fileHandle = (await showOpenFilePicker({
          types: [{
            description: 'Visual SQL files',
            accept: { 'application/json': ['.vsql'] },
          }],
        }))[0]



        // Get file

        const file = await this.$state.saving.fileHandle.getFile()



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



          // Initialize saving state

          this.$state.saving.ignoreChange = true
          this.$state.saving.modified = false
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