<template>
  <div style="position: absolute; left: 0; top: 0">



    <!-- Input sockets -->

    <NodeSocket v-if="node.incomingLinks.length > 0"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: node.incomingLinks.length == 1 ? '0px' : `${-$app.socketOffset.y}px` }"
    @pointerdown="inputPointerDown(0, $event)"
    @pointerup="inputPointerUp(0, $event)">
    </NodeSocket>

    <NodeSocket v-if="node.incomingLinks.length > 1"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: `${$app.socketOffset.y}px` }"
    @pointerdown="inputPointerDown(1, $event)"
    @pointerup="inputPointerUp(1, $event)">
    </NodeSocket>
    



    <!-- Output sockets -->
    
    <NodeSocket v-if="$app.nodeTypes[node.type].hasOutput" style="left: 34px"
    @pointerdown="outputPointerDown" @pointerup="outputPointerUp">
    </NodeSocket>



  </div>
</template>

<script>
export default {


  props: {
    tab: Object,
    node: Object,
  },


  methods: {

    inputPointerDown(socket, event) {
      if (event.button !== 0)
        return

      $state.linking.active = true

      $state.linking.newLink = {
        from: null,
        to: this.node.id,
        socket: socket,
      }
    },
    inputPointerUp(socket, event) {
      if (event.button !== 0)
        return

      if (!$state.linking.active)
        return

      if (typeof($state.linking.newLink.from) === 'number'
      && $state.linking.newLink.from !== this.node.id) {

        $state.linking.newLink.to = this.node.id
        $state.linking.newLink.socket = socket

        $commit('createLink', {
          moduleId: this.tab.moduleId,
          link: $state.linking.newLink,
        })

      }

      $state.linking.active = false
    },


    outputPointerDown(event) {
      if (event.button !== 0)
        return

      $state.linking.active = true

      $state.linking.newLink = {
        from: this.node.id,
        to: null,
        socket: null,
      }
    },
    outputPointerUp(event) {
      if (event.button !== 0)
        return

      if (!$state.linking.active)
        return

      if (typeof($state.linking.newLink.to) === 'number'
      && $state.linking.newLink.to !== this.node.id) {

        $state.linking.newLink.from = this.node.id

        $commit('createLink', {
          moduleId: this.tab.moduleId,
          link: $state.linking.newLink,
        })

      }

      $state.linking.active = false
    },
    
  },

  
}
</script>

<style>

</style>