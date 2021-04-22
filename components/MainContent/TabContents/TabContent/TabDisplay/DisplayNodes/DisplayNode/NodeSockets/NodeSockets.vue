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
      event.target.releasePointerCapture(event.pointerId)
      
      if (event.button !== 0)
        return

      this.tab.newLink = {
        from: null,
        to: this.node.id,
        socket: socket,
      }
    },
    inputPointerUp(socket, event) {
      if (event.button !== 0)
        return

      if (this.tab.newLink == null)
        return

      if (typeof(this.tab.newLink.from) === 'number'
      && this.tab.newLink.from !== this.node.id) {

        this.tab.newLink.to = this.node.id
        this.tab.newLink.socket = socket

        this.$store.commit('createLink', {
          moduleId: this.tab.moduleId,
          link: this.tab.newLink,
        })

      }

      this.tab.newLink = null
    },


    outputPointerDown(event) {
      event.target.releasePointerCapture(event.pointerId)

      if (event.button !== 0)
        return

      this.tab.newLink = {
        from: this.node.id,
        to: null,
        socket: null,
      }
    },
    outputPointerUp(event) {
      if (event.button !== 0)
        return

      if (this.tab.newLink == null)
        return

      if (typeof(this.tab.newLink.to) === 'number'
      && this.tab.newLink.to !== this.node.id) {

        this.tab.newLink.from = this.node.id

        this.$store.commit('createLink', {
          moduleId: this.tab.moduleId,
          link: this.tab.newLink,
        })

      }

      this.tab.newLink = null
    },
    
  },

  
}
</script>

<style>

</style>