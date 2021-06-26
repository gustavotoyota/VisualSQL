<template>
  <v-app-bar app clipped-left clipped-right dense
  style="height: 60px">



    <v-app-bar-title style="flex: none">
      Visual SQL
    </v-app-bar-title>



    <v-divider vertical inset class="ml-4 mr-2"/>



    <NewProject/>
    
    <OpenProject/>
    
    <SaveProject/>



    <v-divider vertical inset class="mx-2"/>



    <v-select dense outlined height="30" class="mx-1"
    style="font-size: 14px; flex: none; width: 160px"
    hide-details background-color="#101010"
    :menu-props="{ top: false, offsetY: true }"

    :items="$app.databases.items" item-text="text" item-value="value"

    v-model="$state.project.sql.database"/>



    <v-divider vertical inset class="mx-2"/>



    <Settings/>



    <v-divider vertical inset class="mx-2"/>



    <ToolbarButton tooltip="Help" btn-style="display: none">
      <v-icon dense>mdi-help-circle</v-icon>
    </ToolbarButton>
    
    <Help/>

    <About/>



    <v-divider vertical inset class="mx-2"/>

                  
                  
    <form action="https://www.paypal.com/donate" method="post" target="_blank"
    style="margin-left: 6px; height: 22px">
      <input type="hidden" name="hosted_button_id" value="746BJR8L4R47U" />
      <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
      <img alt="" border="0" src="https://www.paypal.com/en_BR/i/scr/pixel.gif" width="1" height="1" />
    </form>



    <v-spacer/>



    <div style="margin-left: 14px; min-width: 468px; height: 100%">
      <iframe style="width: 468px; height: 60px; border-width: 0"
      srcdoc="
        <html>
          <head></head>
          <body style='margin: 0; overflow: hidden'>
            <script data-cfasync='false' type='text/javascript' src='https://www.dexpredict.com/a/display.php?r=4715023'></script>
          </body>
        </html>">
      </iframe>

      <!-- Adcash -->
      <!--<script data-cfasync="false" type="text/javascript"
      src="https://www.dexpredict.com/a/display.php?r=4715023"></script>-->
    </div>



  </v-app-bar>
</template>

<script>
export default {

}
</script>

<style scoped>
.v-app-bar /deep/ .v-toolbar__content {
  height: 100% !important;

  padding-right: 0;
}

.v-app-bar-title /deep/ .v-app-bar-title__content {
  visibility: hidden;
}

.v-select /deep/ .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>