<template>

  <v-tooltip bottom v-if="tooltip">

    <template v-slot:activator="{ on: tooltip }">

      <v-btn small text :disabled="disabled"
      style="min-width: 0" :color="color"
      :style="{ 
        ...btnStyle,
        padding: text ? '0 6px': '0',
        width: text ? 'auto': '28px',
      }"
      v-on="tooltip" @click="$emit('click', $event)">
        <slot></slot>
      </v-btn>

    </template>

    <span>{{ tooltip }}</span>

  </v-tooltip>



  <v-btn v-else small text :disabled="disabled"
  style="min-width: 0" :color="color"
  :style="{ 
    ...btnStyle,
    padding: text ? '0 6px': '0',
    width: text ? 'auto': '28px',
  }"
  @click="$emit('click', $event)">
    <slot></slot>
  </v-btn>

</template>

<script>
export default {

  props: {
    tooltip: { type: String },

    disabled: { type: Boolean },

    color: { type: String },

    btnStyle: { type: Object },

    text: { type: Boolean },
  }

}
</script>

<style>

</style>