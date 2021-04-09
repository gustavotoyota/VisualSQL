<template>
  <div class="pa-5">
    <v-list dense>

      <v-list-item-group>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-view-module</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>module_1</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-view-module</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>module_2</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-item-group>

    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        'HTML',
        'CSS',
        'JavaScript'
      ]
    }
  }
}
</script>

<style>

</style>