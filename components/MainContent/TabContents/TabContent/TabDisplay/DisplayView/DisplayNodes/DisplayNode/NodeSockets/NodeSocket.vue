<template>
  <v-hover v-slot="{ hover }">
    <div class="socket"
    :style="{ backgroundColor: hover ? 'white' : '#d0d0d0' }"

    @pointerdown.stop="$emit('pointerdown', $event)"
    @pointerup="$emit('pointerup', $event)">
    </div>
  </v-hover>
</template>

<script>
export default {
}
</script>

<style scoped>
  .socket {
    position: absolute;

    left: 0;
    top: 0;
    
    width: 10px;
    height: 10px;

    transform: translate(-50%, -50%);

    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
      0px 2px 2px 0px rgb(0 0 0 / 14%),
      0px 1px 5px 0px rgb(0 0 0 / 12%);

    border-radius: 9999px;

    pointer-events: auto;

    cursor: pointer;
  }
</style>