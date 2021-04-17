<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: tooltip }">
      <v-btn depressed style="min-width: 28px"
      small width="0" v-on="{ ...tooltip }"
      @click="$emit('click', $event)">
        <slot></slot>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    tooltip: { type: String },
  }
}
</script>

<style>

</style>