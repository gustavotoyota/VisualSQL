import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'



export const strict = false



let initialState = {


  project: {
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
  },
  



  // Sidebars

  sidebars: {
    left: true,
    right: true,
  },


}



export const state = () => (
  JSON.parse(JSON.stringify(initialState)))



export const mutations = {
  updateField,

  


  resetProject(state) {
    this.replaceState(JSON.parse(
      JSON.stringify(initialState)))

    this.commit('createModule', 'module_1')
  },
  



  createModule(state, name) {
    let module = {
      id: state.project.nextModuleId++,

      name: name,

      nodes: {},
      nextNodeId: 0,

      links: {},
      nextLinkId: 0,
    }

    state.project.modules.push(module)
    
    

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

    state.project.modules.splice(this.getters.getModuleIdx(moduleId), 1)
  },




  createTab(state, moduleId) {
    let moduleTab = this.getters.getModuleTab(moduleId)

    if (moduleTab == null) {
      moduleTab = {
        id: state.project.nextTabId++,

        moduleId: moduleId,

        camera: {
          pos: { x: 0, y: 0 },
          zoom: 1,

          panPos: null,

          pinch: {
            pointers: {},
            center: null,
            distance: null,
          },
        },

        nodes: {
          selected: {},
          active: null,

          dragPos: null,

          selection: {
            start: null,
            end: null,
          },
        },

        newLink: null,
      }

      state.project.tabs.push(moduleTab)
    }

    state.project.tabId = moduleTab.id
  },
  closeTab(state, tabId) {
    state.project.tabs.splice(this.getters.getTabIdx(tabId), 1)
  },




  createTable(state, payload) {
    state.project.tables.push({
      id: state.project.nextTableId++,

      name: payload.name,

      columns: payload.columns,
    })
  },
  deleteTable(state, tableId) {
    state.project.tables.splice(
      this.getters.getTableIdx(tableId), 1)
  },




  createNode(state, payload) {
    let module = this.getters.getModule(payload.moduleId)


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
    let module = this.getters.getModule(payload.moduleId)

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
    let module = this.getters.getModule(payload.moduleId)

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
    let module = this.getters.getModule(payload.moduleId)

    let link = module.links[payload.linkId]

    Vue.delete(module.nodes[link.from].outgoingLinks, link.id)
    Vue.set(module.nodes[link.to].incomingLinks, link.socket, null)

    Vue.delete(module.links, link.id)
  },




  deleteSelectedNodes(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

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
    return state.project.modules.findIndex(module => module.id === moduleId)
  },
  getModule: (state, getters) => (moduleId) => {
    return state.project.modules[getters.getModuleIdx(moduleId)]
  },



  getTableIdx: (state) => (tableId) => {
    return state.project.tables.findIndex(table => table.id === tableId)
  },
  getTable: (state, getters) => (tableId) => {
    return state.project.tables[getters.getTableIdx(tableId)]
  },


  
  getTabIdx: (state) => (tabId) => {
    return state.project.tabs.findIndex(tab => tab.id === tabId)
  },
  getTab: (state, getters) => (tabId) => {
    return state.project.tabs[getters.getTabIdx(tabId)]
  },



  getModuleTabIdx: (state) => (moduleId) => {
    return state.project.tabs.findIndex(tab => tab.moduleId === moduleId)
  },
  getModuleTab: (state, getters) => (moduleId) => {
    return state.project.tabs[getters.getModuleTabIdx(moduleId)]
  },



  currentTab(state, getters) {
    return getters.getTab(state.project.tabId)
  },
  currentModule(state, getters) {
    let currentTab = getters.currentTab

    if (currentTab == null)
      return null
      
    return getters.getModule(currentTab.moduleId)
  },



  activeNode(state, getters) {
    let currentTab = getters.currentTab

    if (currentTab == null)
      return null

    return currentTab.nodes.active
  },
}