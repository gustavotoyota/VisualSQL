import { getField, updateField } from 'vuex-map-fields'



export const strict = false



function getInitialState() {
  
  return {

    // Modules

    modules: [],
    nextModuleId: 0,




    // Tables

    tables: [],
    nextTableId: 0,




    // Tabs
    
    tabs: [],
    nextTabId: 0,

    tabId: 0,
    rerenderTabs: 0,

  }
  
}



export const state = () => Object.assign({}, getInitialState())



export const mutations = {
  updateField,

  

  resetProject(state) {
    this.replaceState(getInitialState())

    this.commit('createModule', 'module_1')
  },
  


  createModule(state, name) {
    let module = {
      id: state.nextModuleId++,

      name: name,

      nodes: {},
      nextNodeId: 0,
    }

    state.modules.push(module)
    
    

    this.commit('createNode', {
      moduleId: module.id,

      node: { type: 'output' },

      description: 'Output',
    })



    this.commit('createTab', module.id)
  },
  deleteModule(state, moduleId) {
    let moduleTab = this.getters.getModuleTab(moduleId)
    if (moduleTab != null)
      this.commit('closeTab', moduleTab.id)

    state.modules.splice(this.getters.getModuleIdx(moduleId), 1)
  },



  createTab(state, moduleId) {
    let moduleTab = this.getters.getModuleTab(moduleId)

    if (moduleTab == null) {
      moduleTab = {
        id: state.nextTabId++,

        moduleId: moduleId,

        camera: {
          pos: { x: 0, y: 0 },
          zoom: 1,
        },

        selectedNodes: {},
      }

      state.tabs.push(moduleTab)
    }

    state.tabId = moduleTab.id
  },
  closeTab(state, tabId) {
    state.tabs.splice(this.getters.getTabIdx(tabId), 1)
  },



  createTable(state, payload) {
    state.tables.push({
      id: state.nextTableId++,

      name: payload.name,

      columns: payload.columns,
    })
  },


  createNode(state, payload) {
    let module = state.modules[payload.moduleId]

    let node = Object.assign({
      id: module.nextModuleId++,

      pos: { x: 0, y: 0 },

      incomingLinks: [],
      outgoingLinks: [],

      name: '',
      description: '',

      props: {},
    }, payload.node)

    module.nodes[node.id] = node
  }


}



export const getters = {
  getField,


  

  getModuleIdx: (state) => (moduleId) => {
    return state.modules.findIndex(module => module.id === moduleId)
  },
  getModule: (state, getters) => (moduleId) => {
    return state.modules[getters.getModuleIdx(moduleId)]
  },



  getTableIdx: (state) => (tableId) => {
    return state.tables.findIndex(table => table.id === tableId)
  },
  getTable: (state, getters) => (tableId) => {
    return state.tables[getters.getTableIdx(tableId)]
  },


  
  getTabIdx: (state) => (tabId) => {
    return state.tabs.findIndex(tab => tab.id === tabId)
  },
  getTab: (state, getters) => (tabId) => {
    return state.tabs[getters.getTabIdx(tabId)]
  },



  getModuleTabIdx: (state) => (moduleId) => {
    return state.tabs.findIndex(tab => tab.moduleId === moduleId)
  },
  getModuleTab: (state, getters) => (moduleId) => {
    return state.tabs[getters.getModuleTabIdx(moduleId)]
  },



  currentTab(state, getters) {
    return getters.getTab(state.tabId)
  },
}