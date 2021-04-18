<template>
  <v-app dark>



    <MainMenu>
    </MainMenu>



    <LeftSidebar>
    </LeftSidebar>



    <MainContent>
    </MainContent>



    <RightSidebar>
    </RightSidebar>



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
    this.$store.commit('resetProject')


    this.sidebars.left = innerWidth >= 900
    this.sidebars.right = innerWidth >= 900


    document.addEventListener('keydown', (event) => {
      if (document.activeElement !== document.body)
        return
        
      if (event.code === 'Delete')
        this.$store.commit('deleteSelectedNodes')
    })
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