<template>
  <ToolbarButton tooltip="Save project" @click="onClick"
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
        saveAs($app.saveLoad.createProjectBlob(), 'project.json')

        $state.saving.modified = false

        return
      }



      try {
        $state.saving.fileHandle = await showSaveFilePicker({
          types: [{
            accept: { 'application/json': [] },
          }],
        })

        $app.saveLoad.tryUpdateProjectFile()
      } catch (err) {
        console.log(err)
      }
    },

  },


}
</script>

<style>

</style>