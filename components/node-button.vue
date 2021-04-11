<template>
  <v-tooltip top>

    <template v-slot:activator="{ on, attrs }">

      <v-btn style="min-width: 36px; margin-right: -3px"
      width="0" v-bind="attrs" v-on="on">
        <slot></slot>
      </v-btn>

    </template>
    
    <span>{{ tooltip }}</span>

  </v-tooltip>
</template>

<script>
export default {
  props: {
    icon: '',
    tooltip: '',
  }
}
</script>

<style>

</style>