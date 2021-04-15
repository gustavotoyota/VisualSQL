<template>
  <div style="position: absolute; right: 16px; top: 16px">
    
    <div style="margin-top: 1px">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn style="min-width: 36px"
          width="0" v-on="{ ...tooltip }">
            <v-icon>mdi-magnify-remove-outline</v-icon>
          </v-btn>
        </template>
        <span>Reset zoom</span>
      </v-tooltip>
    </div>

    <div style="margin-top: 1px">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn style="min-width: 36px"
          width="0" v-on="{ ...tooltip }">
            <v-icon>mdi-crop-free</v-icon>
          </v-btn>
        </template>
        <span>Fit screen</span>
      </v-tooltip>
    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>