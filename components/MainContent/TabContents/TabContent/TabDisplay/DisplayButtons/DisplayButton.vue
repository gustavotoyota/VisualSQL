<template>
  <v-tooltip top>

    <template v-slot:activator="{ on: tooltip }">

      <v-btn style="min-width: 36px" width="0"
      :style="btnStyle" :disabled="disabled"

      v-on="tooltip" @click="$emit('click', $event)"
      @pointerdown.stop="$emit('pointerdown', $event)">
        <slot/>
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

    btnStyle: { type: String },

  },

}
</script>

<style>

</style>