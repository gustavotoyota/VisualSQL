<template>

  <DisplayButton btn-style="margin-right: 1px"

  :tooltip="$app.nodeTypes[type].title"

  :disabled="($app.databases.data[$state.project.sql.database].
    infos.disabledNodeTypes || []).includes(type)"
  
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
      $state.nodeCreation.active = true

      $state.nodeCreation.nodeType = this.type
      $state.nodeCreation.props = {}

      $state.nodeCreation.dragStartPos = $utils.shallowCopy($state.pointer.pagePos)
      $state.nodeCreation.visible = false
    },
    

    onClick() {
      if ($state.nodeCreation.visible)
        return

      $commit('createNode', {
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