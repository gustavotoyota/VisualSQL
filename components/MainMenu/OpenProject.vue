<template>

  <ToolbarButton
  @click="onClick"
  tooltip="Open project">

    <v-icon dense>mdi-folder-open</v-icon>

    <input ref="file" accept="application/json"
    class="d-none" type="file"
    @change="onFileChange"/>

  </ToolbarButton>

</template>

<script>
export default {


  methods: {


    onFileChange(event) {
      if (event.target.files.length === 0)
        return

      const file = event.target.files[0]



      const fileReader = new FileReader()

      fileReader.onload = (event) => {
        $app.saveLoad.loadProject(event.target.result)

        $state.saving.fileHandle = null
      }

      fileReader.readAsText(file)



      this.$refs.file.value = ''
    },



    async onClick(event) {
      if (window.showOpenFilePicker == null) {
        this.$refs.file.click()
        return
      }
      

      try {
        // Get file handle

        $state.saving.fileHandle = (await showOpenFilePicker({
          types: [{
            accept: { 'application/json': [] },
          }],
        }))[0]



        // Get file

        const file = await $state.saving.fileHandle.getFile()



        // Read file

        const fileReader = new FileReader()
        
        fileReader.onload = (event) => {
          $app.saveLoad.loadProject(event.target.result)
        }

        fileReader.readAsText(file)
      } catch (err) {
        console.log(err)
      }
    },

  },


}
</script>

<style>

</style>