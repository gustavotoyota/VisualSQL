<template>

  <v-dialog max-width="300" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton tooltip="About"
      v-on="{ ...dialog }" btn-style="width: auto">
        About
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>About Visual SQL</v-card-title>
      
      <v-divider/>

      <v-card-text class="content mt-5 mb-1">
        Developed by Kyota Langard<br/>
        <a href="mailto:kyota.langard@gmail.com">kyota.langard@gmail.com</a><br/>
        
        <div style="margin-top: 18px"><PrivacyPolicy/></div>
      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="primary" text
        @click="active = false">
          Close
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</template>

<script>
export default {


  data() {
    return {
      active: false,
    }
  },


}
</script>

<style scoped>
.content {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

.content * {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}
</style>