<template>

  <v-dialog width="unset" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton tooltip="About"
      v-on="{ ...dialog }" btn-style="width: auto">
        About
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>About Visual SQL</v-card-title>
      
      <v-divider/>

      <v-card-text class="content"
      style="display: flex; padding: 0">

        <div style="padding: 20px 24px">

          Developed with:
          <ul>
            <li>Vue 2.6.12</li>
            <li>Nuxt 2.15.4</li>
            <li>Vuetify 2.4.2</li>
            <li>Monaco Editor 0.23.0</li>
            <li>SortableJS 1.10.2</li>
            <li>FileSaver.js 2.0.5</li>
          </ul>

        </div>

        <v-divider vertical/>

        <div style="padding: 20px 24px;
        display: flex; flex-direction: column">
        
          <p>
            Developed by:
            <ul>
              <li>
                <div>Kyota Langard</div>
                <div><a href="mailto:kyota.langard@gmail.com">kyota.langard@gmail.com</a></div>
              </li>
            </ul>
          </p>

          <v-spacer class="flex-column"/>
          
          <div>
            <div><PrivacyPolicy/></div>
            <div><TermsAndConditions/></div>
          </div>

        </div>

      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer/>

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