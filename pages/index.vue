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
      
      if (currentTab.camera.pinch.pointers.hasOwnProperty(event.pointerId))
        this.$set(currentTab.camera.pinch.pointers, event.pointerId, pointerPos)



        
      // Pinch zoom

      let pointers = Object.values(currentTab.camera.pinch.pointers)

      if (pointers.length >= 2) {
        // Compute center and distance

        let center = {
          x: (pointers[0].x + pointers[1].x) / 2,
          y: (pointers[0].y + pointers[1].y) / 2,
        }

        let distance = Math.sqrt(
          Math.pow(pointers[0].x - pointers[1].x, 2) +
          Math.pow(pointers[0].y - pointers[1].y, 2))




        if (currentTab.camera.pinch.center != null) {
          // Compute ratio

          let ratio = distance / currentTab.camera.pinch.distance




          // Camera position update

          let worldPos = _app.screenToWorld(currentTab, center)

          let centerOffset = {
            x: center.x - currentTab.camera.pinch.center.x,
            y: center.y - currentTab.camera.pinch.center.y,
          }

          currentTab.camera.pos.x = -centerOffset.x / currentTab.camera.zoom +
            worldPos.x + (currentTab.camera.pos.x - worldPos.x) / ratio
          currentTab.camera.pos.y = -centerOffset.y / currentTab.camera.zoom +
            worldPos.y + (currentTab.camera.pos.y - worldPos.y) / ratio



          
          // Camera zoom update
          
          currentTab.camera.zoom = Math.min(Math.max(
            currentTab.camera.zoom * ratio, _app.minZoom), _app.maxZoom)
        }




        currentTab.camera.pinch.center = center
        currentTab.camera.pinch.distance = distance

        return
      }




      if (!event.isPrimary)
        return




      // Pointer position

      this.$state.pointerPos = {
        x: event.pageX,
        y: event.pageY,
      }




      // Panning

      if (currentTab.camera.panPos != null) {
        currentTab.camera.pos.x -= (pointerPos.x - currentTab.camera.panPos.x) / currentTab.camera.zoom
        currentTab.camera.pos.y -= (pointerPos.y - currentTab.camera.panPos.y) / currentTab.camera.zoom
        
        currentTab.camera.panPos = { ...pointerPos }

        if (event.pointerType !== 'mouse' && currentTab.camera.panTimeout != null) {
          let dist = Math.sqrt(
            Math.pow(pointerPos.x - currentTab.camera.panStart.x, 2) +
            Math.pow(pointerPos.y - currentTab.camera.panStart.y, 2))

          if (dist > 5)
            currentTab.camera.panTimeout = null
        }

        return
      }




      // Selecting

      if (currentTab.selection.start != null) {
        currentTab.selection.end = { ...pointerPos }

        return
      }




      // Dragging

      if (currentTab.nodes.dragPos != null) {
        for (let nodeId of Object.keys(currentTab.nodes.selected)) {
          let node = currentModule.nodes[nodeId]

          node.pos.x += (pointerPos.x - currentTab.nodes.dragPos.x) / currentTab.camera.zoom
          node.pos.y += (pointerPos.y - currentTab.nodes.dragPos.y) / currentTab.camera.zoom
        }

        currentTab.nodes.dragPos = { ...pointerPos }
        currentTab.nodes.dragged = true

        return
      }




      // Linking

      if (currentTab.links.new != null) {
        let worldPos = _app.screenToWorld(currentTab, pointerPos)

        if (typeof(currentTab.links.new.from) === 'number')
          currentTab.links.new.to = { ...worldPos }
        else
          currentTab.links.new.from = { ...worldPos }

        return
      }




      // Node creation
      
      if (this.$state.nodeCreation.active && !this.$state.nodeCreation.visible) {
        let dist = Math.sqrt(
          Math.pow(this.$state.pointerPos.x - this.$state.nodeCreation.dragStart.x, 2) +
          Math.pow(this.$state.pointerPos.y - this.$state.nodeCreation.dragStart.y, 2))

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

      if (currentTab.camera.pinch.pointers.hasOwnProperty(event.pointerId)) {
        this.$delete(currentTab.camera.pinch.pointers, event.pointerId)

        if (Object.keys(currentTab.camera.pinch.pointers).length === 1) {
          currentTab.camera.pinch.center = null
          currentTab.camera.pinch.distance = null
        }
      }




      // Panning

      if (currentTab.camera.panPos != null &&
      (event.pointerType !== 'mouse' || event.button === 1)) {
        currentTab.camera.panPos = null
        currentTab.camera.panStart = null
        currentTab.camera.panTimeout = null
      }




      // Selecting

      if (event.button === 0 && currentTab, currentTab.selection.start != null) {
        let worldStart = _app.screenToWorld(currentTab, currentTab.selection.start)
        let worldEnd = _app.screenToWorld(currentTab, currentTab.selection.end)

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

          if (currentTab.nodes.selected.hasOwnProperty(node.id))
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

          if (currentTab.links.selected.hasOwnProperty(link.id))
            this.$delete(currentTab.links.selected, link.id)
          else
            this.$set(currentTab.links.selected, link.id, true)
        }


        currentTab.selection.start = null
        currentTab.selection.end = null
      }




      // Dragging

      if (currentTab.nodes.dragPos != null && event.button === 0) {
        currentTab.nodes.dragPos = null
        
        if (currentTab.nodes.dragged)
          this.$store.commit('saveState')
      }

        


      // Linking
      
      if (currentTab.links.new != null && event.button === 0)
        currentTab.links.new = null
    },





    onDocumentKeyDown(event) {
      if (document.activeElement !== document.body)
        return



      if (event.code === 'KeyA' && event.ctrlKey) {
        this.$store.commit('selectAll')
        return
      }

        

      if (event.code === 'Delete') {
        this.$store.commit('deleteSelection')
        return
      }



      if (event.code === 'KeyX' && event.ctrlKey) {
        this.$store.commit('cutSelectedNodes')
        return
      }
      if (event.code === 'KeyC' && event.ctrlKey) {
        this.$store.commit('copySelectedNodes')
        return
      }
      if (event.code === 'KeyV' && event.ctrlKey) {
        this.$store.commit('pasteNodes')
        return
      }



      if (event.code === 'KeyZ' && event.ctrlKey) {
        this.$store.commit('undo')
        return
      }
      if (event.code === 'KeyY' && event.ctrlKey) {
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
</style>