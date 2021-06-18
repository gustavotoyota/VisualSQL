<template>
  <ToolbarButton tooltip="Open project" @click="onClick">

    <v-icon dense>mdi-folder-open</v-icon>

    <input ref="file"
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

        this.$state.saving.fileHandle = null
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