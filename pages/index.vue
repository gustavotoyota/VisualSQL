<template>

  <div>

    <v-app dark v-show="$state.loaded"
    style="touch-action: none">



      <MainMenu/>
      <LeftSidebar/>
      <MainContent/>
      <RightSidebar/>



      <Snackbar/>

      <NodeDragging/>



    </v-app>



    <SplashScreen/>

  </div>

</template>

<script>
export default {



  mounted() {
    // First time

    this.$state.firstTime = localStorage.getItem('firstTime') === null

    localStorage.setItem('firstTime', false)




    // Loading

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.$state.loaded = true
      }, 1500) 
    })
    
    if (document.readyState === 'complete') {
      setTimeout(() => {
        this.$state.loaded = true
      }, 1500)
    }





    // Help

    if (this.$state.firstTime) {
      setTimeout(() => {
        this.$state.help.title = 'Welcome to Visual SQL!'

        this.$state.help.active = true
      })
    }





    // Sidebars

    this.$state.sidebars.left = innerWidth >= 900
    this.$state.sidebars.right = innerWidth >= 600




    // Global events

    document.addEventListener('pointerdown', this.onDocumentCapturePointerDown, true)
    document.addEventListener('pointermove', this.onDocumentPointerMove)
    document.addEventListener('pointerup', this.onDocumentPointerUp)
    
    document.addEventListener('keydown', this.onDocumentKeyDown)
    
    document.addEventListener('paste', this.onPaste)
  },
  beforeDestroy() {
    document.removeEventListener('pointerdown', this.onDocumentCapturePointerDown, true)
    document.removeEventListener('pointermove', this.onDocumentPointerMove)
    document.removeEventListener('pointerup', this.onDocumentPointerUp)

    document.removeEventListener('keydown', this.onDocumentKeyDown)
    
    document.removeEventListener('paste', this.onPaste)
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

      let displayPos = this.$getters.getDisplayPos(event)
      
      if (event.pointerId in this.$state.pinching.pointers)
        this.$set(this.$state.pinching.pointers, event.pointerId, displayPos)



        
      // Pinch zoom

      let pointers = Object.values(this.$state.pinching.pointers)

      if (pointers.length >= 2) {
        // Compute center and distance

        let centerPos = {
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

          let worldPos = this.$getters.screenToWorld(currentModule, centerPos)

          let centerOffset = {
            x: centerPos.x - this.$state.pinching.centerPos.x,
            y: centerPos.y - this.$state.pinching.centerPos.y,
          }

          currentModule.camera.pos.x = -centerOffset.x / currentModule.camera.zoom +
            worldPos.x + (currentModule.camera.pos.x - worldPos.x) / ratio
          currentModule.camera.pos.y = -centerOffset.y / currentModule.camera.zoom +
            worldPos.y + (currentModule.camera.pos.y - worldPos.y) / ratio



          
          // Camera zoom update
          
          currentModule.camera.zoom = Math.min(Math.max(
            currentModule.camera.zoom * ratio, $app.minZoom), $app.maxZoom)
        }




        this.$state.pinching.centerPos = centerPos
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

      if (this.$state.panning.active) {
        currentModule.camera.pos.x -= (displayPos.x - this.$state.panning.currentPos.x) / currentModule.camera.zoom
        currentModule.camera.pos.y -= (displayPos.y - this.$state.panning.currentPos.y) / currentModule.camera.zoom
        
        this.$state.panning.currentPos = { ...displayPos }

        if (event.pointerType !== 'mouse' && this.$state.panning.selectTimeout != null) {
          let dist = Math.sqrt(
            Math.pow(displayPos.x - this.$state.panning.startPos.x, 2) +
            Math.pow(displayPos.y - this.$state.panning.startPos.y, 2))

          if (dist > 5)
            this.$state.panning.selectTimeout = null
        }

        return
      }




      // Selecting

      if (this.$state.selecting.active) {
        this.$state.selecting.endPos = { ...displayPos }

        return
      }




      // Dragging

      if (this.$state.dragging.active) {
        for (let nodeId of Object.keys(currentTab.nodes.selected)) {
          let node = currentModule.data.nodes.map[nodeId]

          node.pos.x += (displayPos.x - this.$state.dragging.currentPos.x) / currentModule.camera.zoom
          node.pos.y += (displayPos.y - this.$state.dragging.currentPos.y) / currentModule.camera.zoom
        }

        this.$state.dragging.currentPos = { ...displayPos }

        this.$state.dragging.saveState = true

        return
      }




      // Linking

      if (this.$state.linking.active) {
        let worldPos = this.$getters.screenToWorld(currentModule, displayPos)

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

      if (this.$state.panning.active &&
      (event.pointerType !== 'mouse' || event.button === 1)) {
        this.$state.panning.active = false

        this.$state.panning.currentPos = null

        this.$state.panning.startPos = null
        this.$state.panning.selectTimeout = null
      }




      // Selecting

      if (event.button === 0 && this.$state.selecting.active) {
        let worldStart = this.$getters.screenToWorld(currentModule, this.$state.selecting.startPos)
        let worldEnd = this.$getters.screenToWorld(currentModule, this.$state.selecting.endPos)

        let topLeft = {
          x: Math.min(worldStart.x, worldEnd.x),
          y: Math.min(worldStart.y, worldEnd.y),
        }
        let bottomRight = {
          x: Math.max(worldStart.x, worldEnd.x),
          y: Math.max(worldStart.y, worldEnd.y),
        }


        for (let node of Object.values(currentModule.data.nodes.map)) {
          if (node.pos.x < topLeft.x || node.pos.x > bottomRight.x
          || node.pos.y < topLeft.y || node.pos.y > bottomRight.y)
            continue

          if (node.id in currentTab.nodes.selected)
            this.$delete(currentTab.nodes.selected, node.id)
          else
            this.$set(currentTab.nodes.selected, node.id, true)

          if (node.id === currentTab.nodes.activeId)
            currentTab.nodes.activeId = null
        }


        for (let link of Object.values(currentModule.data.links.map)) {
          let linkPos = {
            x: (currentModule.data.nodes.map[link.from].pos.x + currentModule.data.nodes.map[link.to].pos.x) / 2,
            y: (currentModule.data.nodes.map[link.from].pos.y + currentModule.data.nodes.map[link.to].pos.y) / 2,
          }

          if (linkPos.x < topLeft.x || linkPos.x > bottomRight.x
          || linkPos.y < topLeft.y || linkPos.y > bottomRight.y)
            continue

          if (link.id in currentTab.links.selected)
            this.$delete(currentTab.links.selected, link.id)
          else
            this.$set(currentTab.links.selected, link.id, true)

          if (link.id === currentTab.links.activeId)
            currentTab.links.activeId = null
        }


        this.$state.selecting.active = false
      }




      // Dragging

      if (this.$state.dragging.active && event.button === 0) {
        this.$state.dragging.active = false
        
        if (this.$state.dragging.saveState)
          this.$store.commit('saveState')
      }

        


      // Linking
      
      if (this.$state.linking.active && event.button === 0)
        this.$state.linking.active = false
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
      if (window.clipboardData && (event.code === 'KeyV' || event.keyCode === 86) && event.ctrlKey) {
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





    onPaste(event) {
      if (event.target.tagName == 'INPUT' || event.target.tagName == 'TEXTAREA')
        return

      const text = (event.clipboardData || window.clipboardData).getData('text')

      this.$store.commit('paste', text)
    },

  },




  watch: {

    '$state.project': {
      deep: true,

      handler() {
        if (this.$state.saving.ignoreChange) {
          this.$state.saving.ignoreChange = false
          return
        }

        this.$state.saving.modified = true

        if (this.$state.saving.timeout != null)
          clearTimeout(this.$state.saving.timeout)

        this.$state.saving.timeout = setTimeout(() => {
          $app.saveLoad.tryUpdateProjectFile()
        }, 1000)
      },
    },

  },


}
</script>

<style>
*:not(input) {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}





html {
  /* Hide scrollbar */
  overflow-y: hidden;

  /* Disable pull-to-refresh */
  overscroll-behavior-y: none;

  /* Enable smooth scrolling */
  scroll-behavior: smooth;
}




/* Background color */

body {
  background-color: #272727;
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




/* Remove link underline */

a {
  text-decoration: none;
}
</style>