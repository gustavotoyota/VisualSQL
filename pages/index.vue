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



  computed: {

    ..._vuex.mapFields([
      'sidebars',
    ]),

  },



  mounted() {
    this.sidebars.left = innerWidth >= 900
    this.sidebars.right = innerWidth >= 600

    
    document.addEventListener('keydown', this.onDocumentKeyDown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  },



  methods: {

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