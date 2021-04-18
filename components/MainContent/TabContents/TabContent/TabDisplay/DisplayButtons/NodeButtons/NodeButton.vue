<template>
  <v-tooltip top>

    <template v-slot:activator="{ on, attrs }">

      <v-btn style="min-width: 36px; margin-right: -3px"
      width="0" v-bind="attrs" v-on="on"
      @pointerdown.stop="" @click="createNode">
        <NodeIcon :type="type"></NodeIcon>
      </v-btn>

    </template>

    <span>
      <span v-if="type == 'table'">Table</span>
      <span v-else-if="type == 'module'">Module</span>
      <span v-else-if="type == 'node'">Node</span>
      <span v-else-if="type == 'sql'">SQL</span>

      <span v-else-if="type == 'union-all'">Union all</span>
      <span v-else-if="type == 'union'">Union</span>
      <span v-else-if="type == 'except'">Except</span>
      <span v-else-if="type == 'intersect'">Intersect</span>
      
      <span v-else-if="type == 'inner-join'">Inner join</span>
      <span v-else-if="type == 'left-join'">Left join</span>
      <span v-else-if="type == 'right-join'">Right join</span>
      <span v-else-if="type == 'full-join'">Full join</span>
      <span v-else-if="type == 'cross-join'">Cross join</span>

      <span v-else-if="type == 'filter'">Filter</span>
      <span v-else-if="type == 'transform'">Transform</span>
      <span v-else-if="type == 'distinct'">Distinct</span>
      <span v-else-if="type == 'sort'">Sort</span>
      <span v-else-if="type == 'reduce'">Reduce</span>

      <span v-else-if="type == 'pivot'">Pivot</span>
      <span v-else-if="type == 'output'">Output</span>
    </span>

  </v-tooltip>
</template>

<script>


export default {

  props: {
    tab: Object,
    type: String,
  },


  methods: {

    createNode() {
      this.$store.commit('createNode', {
        moduleId: this.tab.moduleId,

        node: {
          type: this.type,

          pos: {
            x: this.tab.camera.pos.x,
            y: this.tab.camera.pos.y,
          },
        },
      })
    },

  },

}
</script>

<style>

</style>