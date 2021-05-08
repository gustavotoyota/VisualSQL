<template>
  <v-tooltip top>

    <template v-slot:activator="{ on }">

      <v-btn style="min-width: 36px; margin-right: -3px"

      width="0" v-bind="attrs" v-on="on"

      :disabled="database.infos.excludedNodeTypes.includes(type)"

      @pointerdown.stop="onPointerDown"
      
      @click="onClick">
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
      <span v-else-if="type == 'difference'">Difference</span>
      <span v-else-if="type == 'intersection'">Intersection</span>
      
      <span v-else-if="type == 'inner-join'">Inner join</span>
      <span v-else-if="type == 'left-join'">Left join</span>
      <span v-else-if="type == 'right-join'">Right join</span>
      <span v-else-if="type == 'full-join'">Full join</span>
      <span v-else-if="type == 'cross-join'">Cross join</span>

      <span v-else-if="type == 'filter'">Filter</span>
      <span v-else-if="type == 'transform'">Transform</span>
      <span v-else-if="type == 'distinct'">Distinct</span>
      <span v-else-if="type == 'sort'">Sort</span>
      <span v-else-if="type == 'limit'">Limit</span>

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



  computed: {

    ..._vuex.mapFields([
      'pointerPos',
      'nodeCreation',
    ]),

    database() {
      return _app.databases[this.$store.state.project.sql.database]
    },

  },



  methods: {


    onClick() {
      if (this.nodeCreation.create)
        return

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



    onPointerDown() {
      this.nodeCreation.nodeType = this.type
      this.nodeCreation.dragStart = _app.shallowCopy(this.pointerPos)
      this.nodeCreation.active = true
      this.nodeCreation.create = false
    },


  },

}
</script>

<style>

</style>