<template>
  <div class="caption" style="position: absolute;
  transform: translate(-50%, -50%); text-align: center;
  max-width: 150px; width: max-content; word-break: break-word"
  :style="{
    left: `${(module.nodes[link.from].pos.x + module.nodes[link.to].pos.x) / 2}px`,
    top: `${(module.nodes[link.from].pos.y + (module.nodes[link.to].pos.y +
    (link.socket * 2 - 1) * 36 +
    ($app.socketOffset.y * (link.socket * 2 - 1)) *
    (module.nodes[link.to].incomingLinks.length - 1))) / 2}px`,
  }">
    {{ link.props.alias }}
  </div>
</template>

<script>
export default {

  props: {
    module: Object,
    link: Object,
  },

}
</script>

<style>

</style>