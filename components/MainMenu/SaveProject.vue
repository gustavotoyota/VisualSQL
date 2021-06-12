<template>
  <ToolbarButton tooltip="Save project"
  @click="onClick"
  :color="$state.saving.modified ? 'purple lighten-3' : ''">
    <v-icon dense>mdi-content-save</v-icon>
  </ToolbarButton>
</template>

<script>
import { saveAs } from 'file-saver'

export default {


  methods: {

    async onClick(event) {
      if (window.showSaveFilePicker == null) {
        saveAs($app.saveLoad.createProjectBlob(), 'project.vsql')

        this.$state.saving.modified = false

        return
      }



      try {
        this.$state.saving.fileHandle = await showSaveFilePicker({
          types: [{
            description: 'Visual SQL files',
            accept: { 'application/json': ['.vsql'] },
          }],
        })

        $app.saveLoad.tryUpdateProjectFile()
      } catch {
      }
    },

  },


}
</script>

<style>

</style>