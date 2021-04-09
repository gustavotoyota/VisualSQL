<template>
  <div class="pa-5">
    <v-list dense>

      <draggable tag="v-list-item-group">

        <v-list-item v-for="item in items" :key="item">
          <v-list-item-icon>
            <v-icon>mdi-view-module</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </draggable>

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