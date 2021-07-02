<template>

  <div>

    <v-app dark v-show="$state.loaded"
    v-resize="onResize" style="touch-action: none">



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



  beforeCreate() {
    // Vue

    global.$set = this.$set
    global.$delete = this.$delete

    global.$vuetify = this.$vuetify



    // Store

    global.$state = this.$store.state
    global.$getters = this.$store.getters
    global.$commit = this.$store.commit
  },




  mounted() {
    // Loading

    function onLoad() {
      setTimeout(() => {

        // Load database from local storage

        const database = localStorage.getItem('database')

        if (database !== null) {
          $state.saving.ignoreNextChange = $state.project.sql.database !== database
          $state.project.sql.database = database
        }




        // Initialize sidebars

        $state.sidebars.left = innerWidth >= 900
        $state.sidebars.right = innerWidth >= 600


        
        
        // Start fading animation

        $state.loaded = true




        if (localStorage.getItem('showWelcomeDialog') === 'false')
          return
        
        setTimeout(() => {
          // Start dialog animation

          $state.help.title = 'Welcome to Visual SQL!'

          $state.help.active = true
        }, 500)

      }, 1500)
    }

    window.addEventListener('load', onLoad)
    
    if (document.readyState === 'complete')
      onLoad()




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

      const currentTab = $getters.currentTab

      if (currentTab == null)
        return

      const currentModule = $getters.currentModule
      


      
      // Compute pointer position

      const displayPos = $getters.getDisplayPos(event)
      
      if (event.pointerId in $state.pinching.pointers)
        $set($state.pinching.pointers, event.pointerId, displayPos)



        
      // Pinch zoom

      const pointers = Object.values($state.pinching.pointers)

      if (pointers.length >= 2) {
        // Compute center and distance

        const centerPos = {
          x: (pointers[0].x + pointers[1].x) / 2,
          y: (pointers[0].y + pointers[1].y) / 2,
        }

        const distance = Math.sqrt(
          Math.pow(pointers[0].x - pointers[1].x, 2) +
          Math.pow(pointers[0].y - pointers[1].y, 2))




        if ($state.pinching.centerPos != null) {
          // Compute ratio

          const ratio = distance / $state.pinching.distance




          // Camera position update

          const worldPos = $getters.screenToWorld(currentModule, centerPos)

          const centerOffset = {
            x: centerPos.x - $state.pinching.centerPos.x,
            y: centerPos.y - $state.pinching.centerPos.y,
          }

          currentModule.camera.pos.x = -centerOffset.x / currentModule.camera.zoom +
            worldPos.x + (currentModule.camera.pos.x - worldPos.x) / ratio
          currentModule.camera.pos.y = -centerOffset.y / currentModule.camera.zoom +
            worldPos.y + (currentModule.camera.pos.y - worldPos.y) / ratio



          
          // Camera zoom update
          
          currentModule.camera.zoom = Math.min(Math.max(
            currentModule.camera.zoom * ratio, $app.minZoom), $app.maxZoom)
        }




        $state.pinching.centerPos = centerPos
        $state.pinching.distance = distance

        return
      }




      if (!event.isPrimary)
        return




      // Pointer position

      $state.pointer.pagePos = {
        x: event.pageX,
        y: event.pageY,
      }




      // Panning

      if ($state.panning.active) {
        currentModule.camera.pos.x -= (displayPos.x - $state.panning.currentPos.x) / currentModule.camera.zoom
        currentModule.camera.pos.y -= (displayPos.y - $state.panning.currentPos.y) / currentModule.camera.zoom
        
        $state.panning.currentPos = $utils.shallowCopy(displayPos)

        if (event.pointerType !== 'mouse' && $state.panning.selectTimeout != null) {
          const dist = Math.sqrt(
            Math.pow(displayPos.x - $state.panning.startPos.x, 2) +
            Math.pow(displayPos.y - $state.panning.startPos.y, 2))

          if (dist > 5)
            $state.panning.selectTimeout = null
        }

        return
      }




      // Selecting

      if ($state.selecting.active) {
        $state.selecting.endPos = $utils.shallowCopy(displayPos)

        return
      }




      // Dragging

      if ($state.dragging.active) {
        for (const nodeId of Object.keys(currentTab.nodes.selected)) {
          const node = currentModule.data.nodes.map[nodeId]

          node.pos.x += (displayPos.x - $state.dragging.currentPos.x) / currentModule.camera.zoom
          node.pos.y += (displayPos.y - $state.dragging.currentPos.y) / currentModule.camera.zoom
        }

        $state.dragging.currentPos = $utils.shallowCopy(displayPos)

        $state.dragging.saveState = true

        return
      }




      // Linking

      if ($state.linking.active) {
        const worldPos = $getters.screenToWorld(currentModule, displayPos)

        if (typeof($state.linking.newLink.from) === 'number')
          $state.linking.newLink.to = $utils.shallowCopy(worldPos)
        else
          $state.linking.newLink.from = $utils.shallowCopy(worldPos)

        return
      }




      // Node creation
      
      if ($state.nodeCreation.active && !$state.nodeCreation.visible) {
        const dist = Math.sqrt(
          Math.pow($state.pointer.pagePos.x - $state.nodeCreation.dragStartPos.x, 2) +
          Math.pow($state.pointer.pagePos.y - $state.nodeCreation.dragStartPos.y, 2))

        $state.nodeCreation.visible = dist >= 8
      }
    },
    onDocumentPointerUp(event) {
      // Get current tab and module

      const currentTab = $getters.currentTab

      if (currentTab == null)
        return

      const currentModule = $getters.currentModule




      // Node creation

      if ($state.nodeCreation.active)
        $state.nodeCreation.active = false


      

      // Remove pinch pointer

      if (event.pointerId in $state.pinching.pointers) {
        $delete($state.pinching.pointers, event.pointerId)

        if (Object.keys($state.pinching.pointers).length === 1) {
          $state.pinching.centerPos = null
          $state.pinching.distance = null
        }
      }




      // Panning

      if ($state.panning.active &&
      (event.pointerType !== 'mouse' || event.button === 1)) {
        $state.panning.active = false

        $state.panning.currentPos = null

        $state.panning.startPos = null
        $state.panning.selectTimeout = null
      }




      // Selecting

      if (event.button === 0 && $state.selecting.active) {
        const worldStart = $getters.screenToWorld(currentModule, $state.selecting.startPos)
        const worldEnd = $getters.screenToWorld(currentModule, $state.selecting.endPos)

        const topLeft = {
          x: Math.min(worldStart.x, worldEnd.x),
          y: Math.min(worldStart.y, worldEnd.y),
        }
        const bottomRight = {
          x: Math.max(worldStart.x, worldEnd.x),
          y: Math.max(worldStart.y, worldEnd.y),
        }


        for (const node of Object.values(currentModule.data.nodes.map)) {
          if (node.pos.x < topLeft.x || node.pos.x > bottomRight.x
          || node.pos.y < topLeft.y || node.pos.y > bottomRight.y)
            continue

          if (node.id in currentTab.nodes.selected)
            $delete(currentTab.nodes.selected, node.id)
          else
            $set(currentTab.nodes.selected, node.id, true)

          if (node.id === currentTab.nodes.activeId)
            currentTab.nodes.activeId = null
        }


        for (const link of Object.values(currentModule.data.links.map)) {
          const linkPos = {
            x: (currentModule.data.nodes.map[link.from].pos.x + currentModule.data.nodes.map[link.to].pos.x) / 2,
            y: (currentModule.data.nodes.map[link.from].pos.y + currentModule.data.nodes.map[link.to].pos.y) / 2,
          }

          if (linkPos.x < topLeft.x || linkPos.x > bottomRight.x
          || linkPos.y < topLeft.y || linkPos.y > bottomRight.y)
            continue

          if (link.id in currentTab.links.selected)
            $delete(currentTab.links.selected, link.id)
          else
            $set(currentTab.links.selected, link.id, true)

          if (link.id === currentTab.links.activeId)
            currentTab.links.activeId = null
        }


        $state.selecting.active = false
      }




      // Dragging

      if ($state.dragging.active && event.button === 0) {
        $state.dragging.active = false
        
        if ($state.dragging.saveState)
          $commit('saveState')
      }

        


      // Linking
      
      if ($state.linking.active && event.button === 0)
        $state.linking.active = false
    },





    onDocumentKeyDown(event) {
      if (event.target.nodeName === 'INPUT'
      || event.target.nodeName === 'TEXTAREA')
        return



      if ((event.code === 'KeyA' || event.keyCode === 65) && event.ctrlKey) {
        $commit('selectAll')
        return
      }

        

      if (event.code === 'Delete' || event.keyCode === 46) {
        $commit('deleteSelection')
        return
      }



      if ((event.code === 'KeyX' || event.keyCode === 88) && event.ctrlKey) {
        $commit('cutSelection')
        return
      }
      if ((event.code === 'KeyC' || event.keyCode === 67) && event.ctrlKey) {
        $commit('copySelection')
        return
      }
      if (window.clipboardData && (event.code === 'KeyV' || event.keyCode === 86) && event.ctrlKey) {
        $commit('paste')
        return
      }



      if ((event.code === 'KeyZ' || event.keyCode === 90) && event.ctrlKey) {
        $commit('undo')
        return
      }
      if ((event.code === 'KeyY' || event.keyCode === 89) && event.ctrlKey) {
        $commit('redo')
        return
      }
    },





    onPaste(event) {
      if (event.target.tagName == 'INPUT' || event.target.tagName == 'TEXTAREA')
        return

      const text = (event.clipboardData || window.clipboardData).getData('text')

      $commit('paste', text)
    },




    onResize(event) {
      if (innerWidth < 697 &&
      $state.sidebars.left && $state.sidebars.right)
        $state.sidebars.left = false
      
      if (innerWidth < 397) {
        $state.sidebars.left = false
        $state.sidebars.right = false
      }
    },

  },




  watch: {

    '$state.project': {
      deep: true,

      handler() {
        if ($state.saving.ignoreNextChange) {
          $state.saving.ignoreNextChange = false
          return
        }

        $state.saving.modified = true

        clearTimeout($state.saving.timeout)

        $state.saving.timeout = setTimeout(() => {
          $app.saveLoad.tryUpdateProjectFile()
        }, 1000)
      },
    },

    '$state.project.sql.database'(value) {
      localStorage.setItem('database', value)
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