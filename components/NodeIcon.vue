<template>
  <v-icon v-if="type == 'table'" :large="large">mdi-table</v-icon>
  <v-icon v-else-if="type == 'node'" :large="large">mdi-image-filter-tilt-shift</v-icon>
  <span v-else-if="type == 'sql'" :style="{
    fontSize: large ? '16px' : '11px', fontWeight: large ? '500' : '700'}">SQL</span>

  <v-icon v-else-if="type == 'union-all'" :large="large">mdi-vector-arrange-above</v-icon>
  <v-icon v-else-if="type == 'union'" :large="large">mdi-vector-combine</v-icon>
  <v-icon v-else-if="type == 'difference'" :large="large">mdi-vector-difference-ba</v-icon>
  <v-icon v-else-if="type == 'intersection'" :large="large">mdi-vector-intersection</v-icon>
  
  <v-icon v-else-if="type == 'inner-join'" :large="large">mdi-set-center</v-icon>
  <v-icon v-else-if="type == 'left-join'" :large="large">mdi-set-left-center</v-icon>
  <v-icon v-else-if="type == 'right-join'" :large="large">mdi-set-center-right</v-icon>
  <v-icon v-else-if="type == 'full-join'" :large="large">mdi-set-left-right</v-icon>
  <v-icon v-else-if="type == 'cross-join'" :large="large">mdi-shuffle</v-icon>

  <v-icon v-else-if="type == 'filter'" :large="large">mdi-filter</v-icon>
  <v-icon v-else-if="type == 'transform'" :large="large">mdi-atom-variant</v-icon>
  <v-icon v-else-if="type == 'distinct'" :large="large">mdi-format-list-bulleted-type</v-icon>
  <v-icon v-else-if="type == 'sort'" :large="large">mdi-sort-ascending</v-icon>
  <v-icon v-else-if="type == 'limit'" :large="large">mdi-arrow-expand-vertical</v-icon>
</template>

<script>
export default {
  props: {
    type: { type: String },
    large: { type: Boolean },
  }
}
</script>

<style>

</style>