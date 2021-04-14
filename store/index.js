export const strict = false



export const state = () => ({
  

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
          
          type: 'transform',

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

    0: {
      id: 0,

      name: 'table_1'
    },

    1: {
      id: 1,

      name: 'table_2'
    },

  },


  
  tabs: [
    {
      id: 0,
      moduleId: 0,

      camera: {
        pos: { x: 0, y: 0 },
        zoom: 1,

        panning: false,
        panPos: { x: 0, y: 0 },
      },
    },

    {
      id: 1,
      moduleId: 1,

      camera: {
        pos: { x: 0, y: 0 },
        zoom: 1,
        
        panning: false,
        panPos: { x: 0, y: 0 },
      },
    },
  ],
  
  
})


export const getters = {
  tab(state) {
    return state.tabs[state.tabId]
  },
  module(state) {
    return state.modules[state.tabs[state.tabId].moduleId]
  },
}