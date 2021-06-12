<template>
  <div class="caption" style="position: absolute;
  transform: translate(-50%, -50%); text-align: center;
  max-width: 150px; width: max-content; word-break: break-word"
  :style="{
    left: `${(module.data.nodes.map[link.from].pos.x + module.data.nodes.map[link.to].pos.x) / 2}px`,
    top: `${(module.data.nodes.map[link.from].pos.y + (module.data.nodes.map[link.to].pos.y +
    ($app.socketOffset.y * (link.socket * 2 - 1)) *
    (module.data.nodes.map[link.to].incomingLinks.length - 1))) / 2}px`,
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