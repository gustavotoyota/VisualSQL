import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'



export const strict = false



let initialState = {

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



export const state = () => { return { ...initialState } }



export const mutations = {
  updateField,

  


  resetProject(state) {
    this.replaceState({ ...initialState })

    this.commit('createModule', 'module_1')
  },
  



  createModule(state, name) {
    let module = {
      id: state.nextModuleId++,

      name: name,

      nodes: {},
      nextNodeId: 0,

      links: {},
      nextLinkId: 0,
    }

    state.modules.push(module)
    
    

    this.commit('createNode', {
      moduleId: module.id,

      node: {
        type: 'output',
      },
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

          panPos: null,
        },

        nodes: {
          selected: {},
          active: null,

          dragPos: null,

          selectionStart: null,
          selectionEnd: null,
        },

        newLink: null,
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


    let nodeTypeInfo = _app.nodeTypes[payload.node.type]


    let node = Object.assign({
      id: module.nextNodeId++,

      pos: { x: 0, y: 0 },

      name: '',
      description: '',

      props: {},
    }, payload.node)

    
    node.incomingLinks = new Array(nodeTypeInfo.numInputs)

    if (nodeTypeInfo.hasOutput)
      node.outgoingLinks = {}


    Vue.set(module.nodes, node.id, node)
  },
  deleteNode(state, payload) {
    let module = state.modules[payload.moduleId]

    let node = module.nodes[payload.nodeId]

    for (let link of node.incomingLinks) {
      if (link != null) {
        this.commit('deleteLink', {
          moduleId: module.id,
          linkId: link.id,
        })
      }
    }

    for (let linkId in node.outgoingLinks) {
      this.commit('deleteLink', {
        moduleId: module.id,
        linkId: linkId,
      })
    }

    Vue.delete(module.nodes, node.id)
  },




  createLink(state, payload) {
    let module = state.modules[payload.moduleId]

    let link = Object.assign({
      id: module.nextLinkId++,
    }, payload.link)

    if (module.nodes[link.to].incomingLinks[link.socket] != null) {
      this.commit('deleteLink', {
        moduleId: module.id,
        linkId: module.nodes[link.to].incomingLinks[link.socket].id,
      })
    }

    Vue.set(module.nodes[link.from].outgoingLinks, link.id, link)
    Vue.set(module.nodes[link.to].incomingLinks, link.socket, link)

    Vue.set(module.links, link.id, link)
  },

  deleteLink(state, payload) {
    let module = state.modules[payload.moduleId]

    let link = module.links[payload.linkId]

    Vue.delete(module.nodes[link.from].outgoingLinks, link.id)
    Vue.set(module.nodes[link.to].incomingLinks, link.socket, null)

    Vue.delete(module.links, link.id)
  },




  deleteSelectedNodes(state) {
    let tab = this.getters.currentTab

    for (let nodeId in tab.nodes.selected) {
      this.commit('deleteNode', {
        moduleId: tab.moduleId,
        nodeId: nodeId,
      })
    }
  },



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
  currentModule(state, getters) {
    let currentTab = getters.currentTab

    if (currentTab == null)
      return null

    return state.modules[currentTab.moduleId]
  },



  activeNode(state, getters) {
    let currentTab = getters.currentTab

    if (currentTab == null)
      return null

    return currentTab.nodes.active
  },
}