<template>
    <v-icon v-if="type == 'table'" :large="large">mdi-table</v-icon>
    <v-icon v-else-if="type == 'module'" :large="large">mdi-cube-outline</v-icon>
    <v-icon v-else-if="type == 'node'" :large="large">mdi-hexagon-outline</v-icon>
    <v-icon v-else-if="type == 'sql'" :large="large">mdi-code-tags</v-icon>

    <v-icon v-else-if="type == 'union-all'" :large="large">mdi-vector-arrange-above</v-icon>
    <v-icon v-else-if="type == 'union'" :large="large">mdi-vector-combine</v-icon>
    <v-icon v-else-if="type == 'except'" :large="large">mdi-vector-difference-ba</v-icon>
    <v-icon v-else-if="type == 'intersect'" :large="large">mdi-vector-intersection</v-icon>
    
    <v-icon v-else-if="type == 'inner-join'" :large="large">mdi-set-center</v-icon>
    <v-icon v-else-if="type == 'left-join'" :large="large">mdi-set-left-center</v-icon>
    <v-icon v-else-if="type == 'right-join'" :large="large">mdi-set-center-right</v-icon>
    <v-icon v-else-if="type == 'full-join'" :large="large">mdi-set-left-right</v-icon>
    <v-icon v-else-if="type == 'cross-join'" :large="large">mdi-shuffle</v-icon>

    <v-icon v-else-if="type == 'filter'" :large="large">mdi-filter</v-icon>
    <v-icon v-else-if="type == 'transform'" :large="large">mdi-atom-variant</v-icon>
    <v-icon v-else-if="type == 'distinct'" :large="large">mdi-format-list-bulleted-type</v-icon>
    <v-icon v-else-if="type == 'sort'" :large="large">mdi-sort-ascending</v-icon>
    <v-icon v-else-if="type == 'reduce'" :large="large">mdi-arrow-expand-vertical</v-icon>

    <span v-else-if="type == 'pivot'" class="material-icons"
    :style="{ 'font-size': large ? '36px' : '' }">
      pivot_table_chart
    </span>
    <v-icon v-else-if="type == 'output'" :large="large">mdi-logout-variant</v-icon>
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