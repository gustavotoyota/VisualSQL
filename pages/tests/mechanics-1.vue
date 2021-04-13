<template>



  <!-- Loading screen -->

  <v-app dark v-if="loading">
  </v-app>





  <v-app dark v-else>




    <!-- App bar -->

    <MainMenu>
    </MainMenu>





    <!-- Left sidebar -->

    <LeftSidebar :modules="modules" :tables="tables">
    </LeftSidebar>



    

    <!-- Main content -->

    <MainContent :modules="modules">
    </MainContent>





    <!-- Right sidebar -->

    <RightSidebar>
    </RightSidebar>




  </v-app>



</template>


<script>
export default {
  data() {
    return {


      loading: false,



      modules: {

        0: {
          id: 0,

          name: 'module_1',

          nodes: {
            
            0: {
              id: 0,

              type: 'table',

              pos: { x: 0, y: 0 },
            },

            1: {
              id: 1,
              
              type: 'filter',

              pos: { x: 200, y: 0 }
            },

          },

          nextNodeId: 2,

        },

        1: {
          id: 1,

          name: 'module_2',

          nodes: {},

          nextNodeId: 0,
        },

      },



      tables: {
        0: { name: 'table_1' },
        1: { name: 'table_2' },
      },


    }
  },




  mounted() {
    window.addEventListener('load', () => {
      this.loading = false
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