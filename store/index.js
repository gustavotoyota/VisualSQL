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




  // Clipboard

  clipboard: null,
  



  // Sidebars

  sidebars: {
    left: true,
    right: true,
  },


}



export const state = () => _app.deepCopy(initialState)



export const mutations = {
  updateField,

  


  resetProject(state) {
    state.project = _app.deepCopy(initialState.project)

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
          panStart: null,
          panTimeout: null,

          pinch: {
            pointers: {},
            center: null,
            distance: null,
          },
        },

        nodes: {
          selected: {},
          activeId: null,

          dragPos: null,
          dragged: false,
        },

        links: {
          new: null,

          selected: {},
          activeId: null,
        },

        selection: {
          start: null,
          end: null,
        },

        states: [],
        currentStateIdx: -1,
      }

      state.project.tabs.push(moduleTab)
    }

    state.project.tabId = moduleTab.id
  },
  closeTab(state, tabId) {
    state.project.tabs.splice(this.getters.getTabIdx(tabId), 1)
  },




  createNode(state, payload) {
    let module = this.getters.getModule(payload.moduleId)


    
    let nodeTypeInfo = _app.nodeTypes[payload.node.type]

    let node = {
      id: module.nextNodeId++,

      pos: { x: 0, y: 0 },

      props: {
        name: '',
        description: '',
      },
    }

    

    node.incomingLinks = new Array(nodeTypeInfo.numInputs)
    node.outgoingLinks = {}



    Object.assign(node.props, nodeTypeInfo.props)
    Object.assign(node, payload.node)



    Vue.set(module.nodes, node.id, node)



    if (!payload.dontSaveState)
      this.commit('saveState')
  },
  deleteNode(state, payload) {
    let module = this.getters.getModule(payload.moduleId)

    let node = module.nodes[payload.nodeId]

    for (let linkId of node.incomingLinks) {
      if (linkId == null)
        continue

      this.commit('deleteLink', {
        moduleId: module.id,
        linkId: linkId,

        dontSaveState: true,
      })
    }

    for (let linkId of Object.keys(node.outgoingLinks)) {
      this.commit('deleteLink', {
        moduleId: module.id,
        linkId: linkId,

        dontSaveState: true,
      })
    }

    Vue.delete(module.nodes, node.id)

    if (!payload.dontSaveState)
      this.commit('saveState')
  },




  createLink(state, payload) {
    let module = this.getters.getModule(payload.moduleId)

    let link = Object.assign({
      id: module.nextLinkId++,
    }, payload.link)

    if (module.nodes[link.to].incomingLinks[link.socket] != null) {
      this.commit('deleteLink', {
        moduleId: module.id,
        linkId: module.nodes[link.to].incomingLinks[link.socket],
      })
    }

    Vue.set(module.nodes[link.from].outgoingLinks, link.id, true)
    Vue.set(module.nodes[link.to].incomingLinks, link.socket, link.id)

    Vue.set(module.links, link.id, link)



    if (!payload.dontSaveState)
      this.commit('saveState')
  },

  deleteLink(state, payload) {
    let module = this.getters.getModule(payload.moduleId)

    let link = module.links[payload.linkId]

    Vue.delete(module.nodes[link.from].outgoingLinks, link.id)
    Vue.set(module.nodes[link.to].incomingLinks, link.socket, null)

    Vue.delete(module.links, link.id)


    
    if (!payload.dontSaveState)
      this.commit('saveState')
  },




  clearSelection(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    tab.nodes.selected = {}
    tab.nodes.activeId = null
    
    tab.links.selected = {}
    tab.links.activeId = null
  },




  deleteSelection(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

      
      
    for (let linkId of Object.keys(tab.links.selected)) {
      this.commit('deleteLink', {
        moduleId: tab.moduleId,
        linkId: linkId,

        dontSaveState: true,
      })
    }

    for (let nodeId of Object.keys(tab.nodes.selected)) {
      this.commit('deleteNode', {
        moduleId: tab.moduleId,
        nodeId: nodeId,

        dontSaveState: true,
      })
    }



    this.commit('clearSelection')
    this.commit('saveState')
  },



  cutSelectedNodes(state) {
    this.commit('copySelectedNodes')
    this.commit('deleteSelection')
  },
  copySelectedNodes(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)
    



    let selectedNodes = []
    for (let nodeId of Object.keys(tab.nodes.selected))
      selectedNodes.push(module.nodes[nodeId])

    if (selectedNodes.length === 0)
      return




    // Calculate center position

    let centerPos = { x: 0, y: 0 }

    for (let node of selectedNodes) {
      centerPos.x += node.pos.x
      centerPos.y += node.pos.y
    }

    centerPos.x /= selectedNodes.length
    centerPos.y /= selectedNodes.length


    

    // Extract nodes

    let nodes = []
    let nodeMap = {}

    for (let node of selectedNodes) {
      nodeMap[node.id] = nodes.length

      nodes.push({
        type: node.type,

        pos: {
          x: node.pos.x - centerPos.x,
          y: node.pos.y - centerPos.y,
        },

        props: _app.deepCopy(node.props),
      })
    }




    // Extract links

    let links = []
    let linkMap = {}

    for (let node of selectedNodes) {
      for (let linkId of node.incomingLinks.concat(
      Object.keys(node.outgoingLinks))) {
        if (linkId == null)
          continue

        if (linkMap.hasOwnProperty(linkId))
          continue

        let link = module.links[linkId]

        if (!tab.nodes.selected.hasOwnProperty(link.from))
          continue

        if (!tab.nodes.selected.hasOwnProperty(link.to))
          continue
        
        linkMap[link.id] = links.length

        links.push({
          from: nodeMap[link.from],
          to: nodeMap[link.to],
          socket: link.socket,
        })
      }
    }




    state.clipboard = {
      nodes: nodes,
      links: links,
    }
  },
  pasteNodes(state) {
    if (state.clipboard == null)
      return



    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)
  
    

    let firstNodeId = module.nextNodeId



    for (let node of state.clipboard.nodes) {
      this.commit('createNode', {
        moduleId: module.id,

        node: {
          type: node.type,

          pos: {
            x: tab.camera.pos.x + node.pos.x,
            y: tab.camera.pos.y + node.pos.y,
          },

          props: _app.deepCopy(node.props),
        },

        dontSaveState: true,
      })
    }



    for (let link of state.clipboard.links) {
      let linkId = module.nextLinkId

      this.commit('createLink', {
        moduleId: module.id,

        link: {
          from: firstNodeId + link.from,
          to: firstNodeId + link.to,
          socket: link.socket,
        },

        dontSaveState: true,
      })

      Vue.set(module.nodes[firstNodeId + link.from].outgoingLinks, linkId, true)
      Vue.set(module.nodes[firstNodeId + link.to].incomingLinks, link.socket, linkId)
    }



    tab.nodes.selected = {}
    for (let nodeId = firstNodeId; nodeId < module.nextNodeId; ++nodeId)
      Vue.set(tab.nodes.selected, nodeId, true)

    tab.nodes.activeId = firstNodeId


    
    this.commit('saveState')
  },




  fitScreen(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)



    
    // Camera position

    let topLeft = { x: Infinity, y: Infinity }
    let bottomRight = { x: -Infinity, y: -Infinity }

    for (let node of Object.values(module.nodes)) {
      topLeft.x = Math.min(topLeft.x, node.pos.x)
      topLeft.y = Math.min(topLeft.y, node.pos.y)

      bottomRight.x = Math.max(bottomRight.x, node.pos.x)
      bottomRight.y = Math.max(bottomRight.y, node.pos.y)
    }

    tab.camera.pos = {
      x: ((topLeft.x + bottomRight.x) / 2) || 0,
      y: ((topLeft.y + bottomRight.y) / 2) || 0,
    }




    // Camera zoom

    let displayRect = _app.getDisplayRect(tab.id)

    tab.camera.zoom = 1

    if (topLeft.x !== tab.camera.pos.x && isFinite(topLeft.x))
      tab.camera.zoom = Math.min(tab.camera.zoom,
        (Math.min(150, displayRect.width / 4) - displayRect.width / 2) /
        (topLeft.x - tab.camera.pos.x))

    if (topLeft.y !== tab.camera.pos.y && isFinite(topLeft.y))
      tab.camera.zoom = Math.min(tab.camera.zoom,
        (Math.min(75, displayRect.height / 4) - displayRect.height / 2) /
        (topLeft.y - tab.camera.pos.y))
 
    tab.camera.zoom = Math.max(tab.camera.zoom, _app.minZoom)
  },




  saveState(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)


    

    let moduleState = _app.deepCopy(module)

    delete moduleState.name
    
    tab.states.splice(++tab.currentStateIdx)
    tab.states.push(JSON.stringify(moduleState))
  },
  replaceState(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)


    

    let moduleState = _app.deepCopy(module)

    delete moduleState.name
    
    tab.states.splice(tab.currentStateIdx)
    Vue.set(tab.states, tab.currentStateIdx, JSON.stringify(moduleState))
  },




  undo(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)




    if (tab.currentStateIdx === 0)
      return

    tab.nodes.selected = {}
    tab.nodes.activeId = null

    Object.assign(module, JSON.parse(tab.states[--tab.currentStateIdx]))
  },
  redo(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)




    if (tab.currentStateIdx === tab.states.length - 1)
      return

    tab.nodes.selected = {}
    tab.nodes.activeId = null
    
    Object.assign(module, JSON.parse(tab.states[++tab.currentStateIdx]))
  },




  selectAllNodes(state) {
    let tab = this.getters.currentTab

    if (tab == null)
      return

    let module = this.getters.getModule(tab.moduleId)
      


    tab.nodes.selected = {}
    for (let node of Object.values(module.nodes))
      Vue.set(tab.nodes.selected, node.id, true)
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

    let currentModule = getters.getModule(currentTab.moduleId)

    return currentModule.nodes[currentTab.nodes.activeId]
  },
}