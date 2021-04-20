<template>
  <div style="position: absolute; right: 16px; top: 16px">
    
    <div style="margin-top: 1px">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn style="min-width: 36px" width="0" v-on="{ ...tooltip }"
          @pointerdown.stop="" @click="tab.camera.zoom = 1">
            <v-icon>mdi-magnify-remove-outline</v-icon>
          </v-btn>
        </template>
        <span>Reset zoom</span>
      </v-tooltip>
    </div>

    <div style="margin-top: 1px">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn style="min-width: 36px" width="0" v-on="{ ...tooltip }"
          @pointerdown.stop="" @click="fitScreen">
            <v-icon>mdi-crop-free</v-icon>
          </v-btn>
        </template>
        <span>Fit screen</span>
      </v-tooltip>
    </div>

  </div>
</template>

<script>
export default {

  props: {
    tab: Object,
    module: Object,
  },


  methods: {

    fitScreen() {
      // Camera position

      let topLeft = { x: Infinity, y: Infinity }
      let bottomRight = { x: -Infinity, y: -Infinity }

      for (let node of Object.values(this.module.nodes)) {
        topLeft.x = Math.min(topLeft.x, node.pos.x)
        topLeft.y = Math.min(topLeft.y, node.pos.y)

        bottomRight.x = Math.max(bottomRight.x, node.pos.x)
        bottomRight.y = Math.max(bottomRight.y, node.pos.y)
      }

      this.tab.camera.pos = {
        x: ((topLeft.x + bottomRight.x) / 2) || 0,
        y: ((topLeft.y + bottomRight.y) / 2) || 0,
      }



      // Camera zoom

      let displayRect = _app.getDisplayRect(this.tab.id)

      this.tab.camera.zoom = 1

      if (topLeft.x !== this.tab.camera.pos.x)
        this.tab.camera.zoom = Math.min(this.tab.camera.zoom,
          (Math.min(150, displayRect.width / 4) - displayRect.width / 2) /
          (topLeft.x - this.tab.camera.pos.x))

      if (topLeft.y !== this.tab.camera.pos.y)
        this.tab.camera.zoom = Math.min(this.tab.camera.zoom,
          (Math.min(75, displayRect.height / 4) - displayRect.height / 2) /
          (topLeft.y - this.tab.camera.pos.y))
    },

  },

}
</script>

<style>

</style>