<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: tooltip }">
      <v-btn style="min-width: 28px; padding: 0"
      small text width="0" v-on="{ ...tooltip }"
      :disabled="disabled" @click="$emit('click', $event)">
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
    disabled: { type: Boolean }
  }
}
</script>

<style>

</style>