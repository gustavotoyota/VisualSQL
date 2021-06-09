<template>
  <v-app dark style="touch-action: none">



    <MainMenu/>



    <LeftSidebar/>



    <MainContent/>



    <RightSidebar/>



    <Snackbar/>
    


    <NodeDragging/>



  </v-app>
</template>

<script>
export default {



  mounted() {
    this.$state.sidebars.left = innerWidth >= 900
    this.$state.sidebars.right = innerWidth >= 600



    document.addEventListener('pointerdown', this.onDocumentCapturePointerDown, true)
    document.addEventListener('pointermove', this.onDocumentPointerMove)
    document.addEventListener('pointerup', this.onDocumentPointerUp)
    
    document.addEventListener('keydown', this.onDocumentKeyDown)
  },
  beforeDestroy() {
    document.removeEventListener('pointerdown', this.onDocumentCapturePointerDown, true)
    document.removeEventListener('pointermove', this.onDocumentPointerMove)
    document.removeEventListener('pointerup', this.onDocumentPointerUp)

    document.removeEventListener('keydown', this.onDocumentKeyDown)
  },



  methods: {
    
    
    onDocumentCapturePointerDown(event) {
      event.target.releasePointerCapture(event.pointerId)
    },
    onDocumentPointerMove(event) {
      // Get current tab and module

      let currentTab = this.$getters.currentTab

      if (currentTab == null)
        return

      let currentModule = this.$getters.currentModule
      


      
      // Compute pointer position

      let pointerPos = _app.getPointerPos(event)
      
      if (event.pointerId in this.$state.pinching.pointers)
        this.$set(this.$state.pinching.pointers, event.pointerId, pointerPos)



        
      // Pinch zoom

      let pointers = Object.values(this.$state.pinching.pointers)

      if (pointers.length >= 2) {
        // Compute center and distance

        let center = {
          x: (pointers[0].x + pointers[1].x) / 2,
          y: (pointers[0].y + pointers[1].y) / 2,
        }

        let distance = Math.sqrt(
          Math.pow(pointers[0].x - pointers[1].x, 2) +
          Math.pow(pointers[0].y - pointers[1].y, 2))




        if (this.$state.pinching.centerPos != null) {
          // Compute ratio

          let ratio = distance / this.$state.pinching.distance




          // Camera position update

          let worldPos = _app.screenToWorld(currentTab, center)

          let centerOffset = {
            x: center.x - this.$state.pinching.centerPos.x,
            y: center.y - this.$state.pinching.centerPos.y,
          }

          currentTab.camera.pos.x = -centerOffset.x / currentTab.camera.zoom +
            worldPos.x + (currentTab.camera.pos.x - worldPos.x) / ratio
          currentTab.camera.pos.y = -centerOffset.y / currentTab.camera.zoom +
            worldPos.y + (currentTab.camera.pos.y - worldPos.y) / ratio



          
          // Camera zoom update
          
          currentTab.camera.zoom = Math.min(Math.max(
            currentTab.camera.zoom * ratio, _app.minZoom), _app.maxZoom)
        }




        this.$state.pinching.centerPos = center
        this.$state.pinching.distance = distance

        return
      }




      if (!event.isPrimary)
        return




      // Pointer position

      this.$state.pointer.pagePos = {
        x: event.pageX,
        y: event.pageY,
      }




      // Panning

      if (this.$state.panning.currentPos != null) {
        currentTab.camera.pos.x -= (pointerPos.x - this.$state.panning.currentPos.x) / currentTab.camera.zoom
        currentTab.camera.pos.y -= (pointerPos.y - this.$state.panning.currentPos.y) / currentTab.camera.zoom
        
        this.$state.panning.currentPos = { ...pointerPos }

        if (event.pointerType !== 'mouse' && this.$state.panning.selectTimeout != null) {
          let dist = Math.sqrt(
            Math.pow(pointerPos.x - this.$state.panning.startPos.x, 2) +
            Math.pow(pointerPos.y - this.$state.panning.startPos.y, 2))

          if (dist > 5)
            this.$state.panning.selectTimeout = null
        }

        return
      }




      // Selecting

      if (this.$state.selecting.startPos != null) {
        this.$state.selecting.endPos = { ...pointerPos }

        return
      }




      // Dragging

      if (this.$state.dragging.currentPos != null) {
        for (let nodeId of Object.keys(currentTab.nodes.selected)) {
          let node = currentModule.nodes[nodeId]

          node.pos.x += (pointerPos.x - this.$state.dragging.currentPos.x) / currentTab.camera.zoom
          node.pos.y += (pointerPos.y - this.$state.dragging.currentPos.y) / currentTab.camera.zoom
        }

        this.$state.dragging.currentPos = { ...pointerPos }
        this.$state.dragging.dragged = true

        return
      }




      // Linking

      if (this.$state.linking.newLink != null) {
        let worldPos = _app.screenToWorld(currentTab, pointerPos)

        if (typeof(this.$state.linking.newLink.from) === 'number')
          this.$state.linking.newLink.to = { ...worldPos }
        else
          this.$state.linking.newLink.from = { ...worldPos }

        return
      }




      // Node creation
      
      if (this.$state.nodeCreation.active && !this.$state.nodeCreation.visible) {
        let dist = Math.sqrt(
          Math.pow(this.$state.pointer.pagePos.x - this.$state.nodeCreation.dragStartPos.x, 2) +
          Math.pow(this.$state.pointer.pagePos.y - this.$state.nodeCreation.dragStartPos.y, 2))

        this.$state.nodeCreation.visible = dist >= 8
      }
    },
    onDocumentPointerUp(event) {
      // Get current tab and module

      let currentTab = this.$getters.currentTab

      if (currentTab == null)
        return

      let currentModule = this.$getters.currentModule




      // Node creation

      if (this.$state.nodeCreation.active)
        this.$state.nodeCreation.active = false


      

      // Remove pinch pointer

      if (event.pointerId in this.$state.pinching.pointers) {
        this.$delete(this.$state.pinching.pointers, event.pointerId)

        if (Object.keys(this.$state.pinching.pointers).length === 1) {
          this.$state.pinching.centerPos = null
          this.$state.pinching.distance = null
        }
      }




      // Panning

      if (this.$state.panning.currentPos != null &&
      (event.pointerType !== 'mouse' || event.button === 1)) {
        this.$state.panning.currentPos = null

        this.$state.panning.startPos = null
        this.$state.panning.selectTimeout = null
      }




      // Selecting

      if (event.button === 0 && currentTab, this.$state.selecting.startPos != null) {
        let worldStart = _app.screenToWorld(currentTab, this.$state.selecting.startPos)
        let worldEnd = _app.screenToWorld(currentTab, this.$state.selecting.endPos)

        let topLeft = {
          x: Math.min(worldStart.x, worldEnd.x),
          y: Math.min(worldStart.y, worldEnd.y),
        }
        let bottomRight = {
          x: Math.max(worldStart.x, worldEnd.x),
          y: Math.max(worldStart.y, worldEnd.y),
        }


        for (let node of Object.values(currentModule.nodes)) {
          if (node.pos.x < topLeft.x || node.pos.x > bottomRight.x
          || node.pos.y < topLeft.y || node.pos.y > bottomRight.y)
            continue

          if (node.id in currentTab.nodes.selected)
            this.$delete(currentTab.nodes.selected, node.id)
          else
            this.$set(currentTab.nodes.selected, node.id, true)
        }


        for (let link of Object.values(currentModule.links)) {
          let linkPos = {
            x: (currentModule.nodes[link.from].pos.x + currentModule.nodes[link.to].pos.x) / 2,
            y: (currentModule.nodes[link.from].pos.y + currentModule.nodes[link.to].pos.y) / 2,
          }

          if (linkPos.x < topLeft.x || linkPos.x > bottomRight.x
          || linkPos.y < topLeft.y || linkPos.y > bottomRight.y)
            continue

          if (link.id in currentTab.links.selected)
            this.$delete(currentTab.links.selected, link.id)
          else
            this.$set(currentTab.links.selected, link.id, true)
        }


        this.$state.selecting.startPos = null
        this.$state.selecting.endPos = null
      }




      // Dragging

      if (this.$state.dragging.currentPos != null && event.button === 0) {
        this.$state.dragging.currentPos = null
        
        if (this.$state.dragging.dragged)
          this.$store.commit('saveState')
      }

        


      // Linking
      
      if (this.$state.linking.newLink != null && event.button === 0)
        this.$state.linking.newLink = null
    },





    onDocumentKeyDown(event) {
      if (event.target.nodeName === 'INPUT'
      || event.target.nodeName === 'TEXTAREA')
        return



      if ((event.code === 'KeyA' || event.keyCode === 65) && event.ctrlKey) {
        this.$store.commit('selectAll')
        return
      }

        

      if (event.code === 'Delete' || event.keyCode === 46) {
        this.$store.commit('deleteSelection')
        return
      }



      if ((event.code === 'KeyX' || event.keyCode === 88) && event.ctrlKey) {
        this.$store.commit('cutSelection')
        return
      }
      if ((event.code === 'KeyC' || event.keyCode === 67) && event.ctrlKey) {
        this.$store.commit('copySelection')
        return
      }
      if ((event.code === 'KeyV' || event.keyCode === 86) && event.ctrlKey) {
        this.$store.commit('paste')
        return
      }



      if ((event.code === 'KeyZ' || event.keyCode === 90) && event.ctrlKey) {
        this.$store.commit('undo')
        return
      }
      if ((event.code === 'KeyY' || event.keyCode === 89) && event.ctrlKey) {
        this.$store.commit('redo')
        return
      }
    },

  },


}
</script>

<style>
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}




/* Hide scrollbar */

html {
  overflow-y: auto;
}



/* Disable pull-to-refresh */

html {
  overscroll-behavior-y: none;
}




/* Sidebars */

.v-navigation-drawer__content {
  height: 100%;

  display: flex;
  flex-direction: column;
}



/* Tab height */

.v-window__container {
  height: 100% !important;
}



/* Main content height */

.v-main__wrap {
  height: 100%;

  display: flex;
  flex-direction: column;
}



/* List padding */

.v-menu__content .v-list {
  padding: 0 !important
}




/* Scrollbars */

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: #202020;
}

::-webkit-scrollbar-thumb {
  background: #303030;
  border: solid 1px #404040;
}

::-webkit-scrollbar-thumb:hover {
  background: #404040;
}




/* Dialog overflow */

.v-dialog {
  overflow: visible;
}




/* IE11 button fix */

.v-btn {
  padding: 0 !important;
}
</style>