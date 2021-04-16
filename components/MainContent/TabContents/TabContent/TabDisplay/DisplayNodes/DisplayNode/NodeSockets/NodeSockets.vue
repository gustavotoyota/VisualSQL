<template>
  <div style="position: absolute; left: 0; top: 0">


    <!-- Input sockets -->

    <NodeSocket v-if="node.incomingLinks.length > 0"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: node.incomingLinks.length == 1 ? '0px' : `${-$app.socketOffset.y}px` }"
    @mousedown="inputMouseDown(0)"
    @mouseup="inputMouseUp(0)">
    </NodeSocket>

    <NodeSocket v-if="node.incomingLinks.length > 1"
    :style="{ left: `${-$app.socketOffset.x}px`,
    top: `${$app.socketOffset.y}px` }"
    @mousedown="inputMouseDown(1)"
    @mouseup="inputMouseUp(1)">
    </NodeSocket>
    


    <!-- Output sockets -->
    
    <NodeSocket v-if="node.outgoingLinks != null" style="left: 34px"
    @mousedown="outputMouseDown" @mouseup="outputMouseUp">
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

    inputMouseDown(socket) {
      this.tab.newLink = {
        from: null,
        to: this.node.id,
        socket: socket,
      }
    },
    inputMouseUp(socket) {
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


    outputMouseDown() {
      this.tab.newLink = {
        from: this.node.id,
        to: null,
        socket: null,
      }
    },
    outputMouseUp() {
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