<template>

  <v-tooltip bottom>

    <template v-slot:activator="{ on: tooltip }">

      <v-btn small text :style="btnStyle"
      :disabled="disabled" :color="color"
      style="min-width: 0; width: 28px; padding: 0"

      v-on="{ ...tooltip }"
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

    disabled: { type: Boolean },

    color: { type: String },

    btnStyle: { type: String },
  }

}
</script>

<style>

</style>