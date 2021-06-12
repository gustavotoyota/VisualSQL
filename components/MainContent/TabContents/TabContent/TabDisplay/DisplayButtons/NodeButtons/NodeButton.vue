<template>

  <DisplayButton btn-style="margin-right: 1px"

  :tooltip="$app.nodeTypes[type].title"

  :disabled="$app.databases.data[$state.project.sql.database].infos.disabledNodeTypes.includes(type)"
  
  @pointerdown.stop="onPointerDown"
  @click="onClick">
  
    <NodeIcon :type="type"></NodeIcon>

  </DisplayButton>

</template>

<script>


export default {



  props: {
    tab: Object,
    module: Object,
    
    type: String,
  },



  methods: {


    onPointerDown() {
      this.$state.nodeCreation.active = true
      this.$state.nodeCreation.nodeType = this.type
      this.$state.nodeCreation.dragStartPos = $utils.shallowCopy(this.$state.pointer.pagePos)
      this.$state.nodeCreation.visible = false
    },
    

    onClick() {
      if (this.$state.nodeCreation.visible)
        return

      this.$store.commit('createNode', {
        moduleId: this.tab.moduleId,

        node: {
          type: this.type,

          pos: {
            x: this.module.camera.pos.x,
            y: this.module.camera.pos.y,
          },
        },
      })
    },


  },

}
</script>

<style>

</style>