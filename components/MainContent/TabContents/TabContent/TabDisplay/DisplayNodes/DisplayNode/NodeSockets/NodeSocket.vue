<template>
  <v-hover v-slot="{ hover }">
    <div class="socket"
    :style="{ backgroundColor: hover ? 'white' : '#d0d0d0' }"

    @mousedown.stop="$emit('mousedown', $event)"
    @mouseup="$emit('mouseup', $event)"

    @touchstart.stop="$emit('mousedown', { button: 0 })"
    @touchend="onTouchEnd">
    </div>
  </v-hover>
</template>

<script>
export default {

  methods: {

    onTouchEnd(event) {
      let targetElem = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY,
      )

      let mouseEvent = document.createEvent('MouseEvents')

      mouseEvent.initMouseEvent('mouseup', false, false, document.defaultView,
      0, 0, 0, 0, 0, false, false, false, false, 0, targetElem)

      targetElem.dispatchEvent(mouseEvent)
    },

  },

}
</script>

<style>
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