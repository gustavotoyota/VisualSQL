import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'



export const strict = false



export const state = () => ({


  // Project

  project: null,
  



  // Sidebars

  sidebars: {
    left: true,
    right: true,
  },



  
  // Tabs

  tabs: {
    rerender: 0,
  },




  // Pointer position

  pointer: {
    pagePos: { x: 0, y: 0 },
  },




  // Panning
  
  panning: {
    currentPos: null,

    startPos: null,
    selectTimeout: null,
  },




  // Pinching

  pinching: {
    pointers: {},
    
    centerPos: null,
    distance: null,
  },




  // Dragging
  
  dragging: {
    currentPos: null,
    dragged: false,
  },




  // Linking
  
  linking: {
    newLink: null,
  },




  // Selecting

  selecting: {
    startPos: null,
    endPos: null,
  },


  

  // Node creation

  nodeCreation: {
    active: false,
    nodeType: null,
    dragStartPos: null,
    visible: false,
  },
  



  // Clipboard

  clipboard: {
    value: null,
  },

  


  // Snackbar

  snackbar: {
    active: false,
    text: '',
  },


})





// Mutations

export const mutations = {}



mutations.updateField = updateField


  
mutations.resetProject = function (state) {
  state.project = {
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




    // SQL

    sql: {
      database: 'mysql',

      uppercaseKeywords: true,

      indentWithSpaces: true,
      indentSize: 2,
    },
  }

  this.commit('createModule', 'module_1')
}
  



mutations.createModule = function (state, name) {
  let module = {
    id: state.project.nextModuleId++,

    name: name,

    nodes: {},
    nextNodeId: 0,

    links: {},
    nextLinkId: 0,
  }

  state.project.modules.push(module)



  this.commit('createTab', module.id)
}
mutations.deleteModule = function (state, moduleId) {
  let moduleTab = this.getters.getModuleTab(moduleId)
  if (moduleTab != null)
    this.commit('closeTab', moduleTab.id)

  state.project.modules.splice(this.getters.getModuleIdx(moduleId), 1)
}




mutations.createTable = function (state, payload) {
  state.project.tables.push({
    id: state.project.nextTableId++,

    name: payload.name,

    columns: payload.columns,
  })
}
mutations.deleteTable = function (state, tableId) {
  state.project.tables.splice(
    this.getters.getTableIdx(tableId), 1)
}




mutations.createTab = function (state, moduleId) {
  let moduleTab = this.getters.getModuleTab(moduleId)

  if (moduleTab == null) {
    moduleTab = {
      id: state.project.nextTabId++,

      moduleId: moduleId,

      camera: {
        pos: { x: 0, y: 0 },
        zoom: 1,
      },

      nodes: {
        selected: {},
        activeId: null,
      },

      links: {
        selected: {},
        activeId: null,
      },

      undoRedo: {
        states: [],
        currentStateIdx: -1,
      },
    }

    state.project.tabs.push(moduleTab)
  }

  state.project.tabId = moduleTab.id
  
  if (moduleTab.undoRedo.currentStateIdx < 0)
    this.commit('saveState')
}
mutations.closeTab = function (state, tabId) {
  state.project.tabs.splice(this.getters.getTabIdx(tabId), 1)
}




mutations.createNode = function (state, payload) {
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



  Object.assign(node.props, _app.deepCopy(nodeTypeInfo.props))
  Object.assign(node, payload.node)



  Vue.set(module.nodes, node.id, node)



  if (!payload.dontSaveState)
    this.commit('saveState')
}
mutations.deleteNode = function (state, payload) {
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
}




mutations.createLink = function (state, payload) {
  // Create link

  let module = this.getters.getModule(payload.moduleId)

  let link = Object.assign({
    id: module.nextLinkId++,

    props: {
      alias: '',
    },
  }, payload.link)




  // Delete existing link

  let existingLinkId = module.nodes[link.to].incomingLinks[link.socket]

  if (existingLinkId != null) {
    link.props = _app.deepCopy(module.links[existingLinkId].props)

    this.commit('deleteLink', {
      moduleId: module.id,
      linkId: existingLinkId,

      dontSaveState: true,
    })
  }


  

  // Setup link references

  Vue.set(module.nodes[link.from].outgoingLinks, link.id, true)
  Vue.set(module.nodes[link.to].incomingLinks, link.socket, link.id)

  Vue.set(module.links, link.id, link)




  if (!payload.dontSaveState)
    this.commit('saveState')
}
mutations.deleteLink = function (state, payload) {
  let module = this.getters.getModule(payload.moduleId)

  let link = module.links[payload.linkId]

  Vue.delete(module.nodes[link.from].outgoingLinks, link.id)
  Vue.set(module.nodes[link.to].incomingLinks, link.socket, null)

  Vue.delete(module.links, link.id)


  
  if (!payload.dontSaveState)
    this.commit('saveState')
}




mutations.clearSelection = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return


    
  tab.nodes.selected = {}
  tab.nodes.activeId = null
  
  tab.links.selected = {}
  tab.links.activeId = null
}
mutations.selectAll = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)
    


  tab.nodes.selected = {}
  for (let node of Object.values(module.nodes))
    Vue.set(tab.nodes.selected, node.id, true)
    
  tab.links.selected = {}
  for (let link of Object.values(module.links))
    Vue.set(tab.links.selected, link.id, true)
}





mutations.deleteSelection = function (state) {
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
}



mutations.cutSelectedNodes = function (state) {
  this.commit('copySelectedNodes')
  this.commit('deleteSelection')
}
mutations.copySelectedNodes = function (state) {
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

        props: _app.deepCopy(link.props),
      })
    }
  }




  state.clipboard.value = {
    nodes: nodes,
    links: links,
  }
}
mutations.pasteNodes = function (state) {
  if (state.clipboard.value == null)
    return



  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)

  

  let firstNodeId = module.nextNodeId
  let firstLinkId = module.nextLinkId



  for (let node of state.clipboard.value.nodes) {
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



  for (let link of state.clipboard.value.links) {
    let linkId = module.nextLinkId

    this.commit('createLink', {
      moduleId: module.id,

      link: {
        from: firstNodeId + link.from,
        to: firstNodeId + link.to,
        socket: link.socket,

        props: _app.deepCopy(link.props),
      },

      dontSaveState: true,
    })

    Vue.set(module.nodes[firstNodeId + link.from].outgoingLinks, linkId, true)
    Vue.set(module.nodes[firstNodeId + link.to].incomingLinks, link.socket, linkId)
  }





  tab.nodes.selected = {}
  for (let nodeId = firstNodeId; nodeId < module.nextNodeId; ++nodeId)
    Vue.set(tab.nodes.selected, nodeId, true)

  tab.links.selected = {}
  for (let linkId = firstLinkId; linkId < module.nextLinkId; ++linkId)
    Vue.set(tab.links.selected, linkId, true)

  tab.nodes.activeId = firstNodeId
  tab.links.activeId = null


  
  this.commit('saveState')
}




mutations.fitScreen = function (state) {
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

  let displayRect = _app.getDisplayRect()

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
}




mutations.saveState = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)


  

  let moduleState = _app.deepCopy(module)

  delete moduleState.name
  
  tab.undoRedo.states.splice(++tab.undoRedo.currentStateIdx)
  tab.undoRedo.states.push(JSON.stringify(moduleState))
}
mutations.replaceState = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)


  

  let moduleState = _app.deepCopy(module)

  delete moduleState.name
  
  tab.undoRedo.states.splice(tab.undoRedo.currentStateIdx)
  Vue.set(tab.undoRedo.states, tab.undoRedo.currentStateIdx, JSON.stringify(moduleState))
}




mutations.undo = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)




  if (tab.undoRedo.currentStateIdx === 0)
    return

  this.commit('clearSelection')

  Object.assign(module, JSON.parse(tab.undoRedo.states[--tab.undoRedo.currentStateIdx]))
}
mutations.redo = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)




  if (tab.undoRedo.currentStateIdx === tab.undoRedo.states.length - 1)
    return

  this.commit('clearSelection')
  
  Object.assign(module, JSON.parse(tab.undoRedo.states[++tab.undoRedo.currentStateIdx]))
}




// Getters

export const getters = {}




getters.getField = getField


  

getters.getModuleIdx = (state) => (moduleId) => {
  return state.project.modules.findIndex(module => module.id === moduleId)
}
getters.getModule = (state, getters) => (moduleId) => {
  return state.project.modules[getters.getModuleIdx(moduleId)]
}




getters.getTableIdx = (state) => (tableId) => {
  return state.project.tables.findIndex(table => table.id === tableId)
}
getters.getTable = (state, getters) => (tableId) => {
  return state.project.tables[getters.getTableIdx(tableId)]
}




getters.getTabIdx = (state) => (tabId) => {
  return state.project.tabs.findIndex(tab => tab.id === tabId)
}
getters.getTab = (state, getters) => (tabId) => {
  return state.project.tabs[getters.getTabIdx(tabId)]
}




getters.getModuleTabIdx = (state) => (moduleId) => {
  return state.project.tabs.findIndex(tab => tab.moduleId === moduleId)
}
getters.getModuleTab = (state, getters) => (moduleId) => {
  return state.project.tabs[getters.getModuleTabIdx(moduleId)]
}




getters.currentTab = (state, getters) => {
  return getters.getTab(state.project.tabId)
}
getters.currentModule = (state, getters) => {
  let currentTab = getters.currentTab

  if (currentTab == null)
    return null
    
  return getters.getModule(currentTab.moduleId)
}




getters.activeNode = (state, getters) => {
  let currentTab = getters.currentTab

  if (currentTab == null)
    return null

  let currentModule = getters.getModule(currentTab.moduleId)

  return currentModule.nodes[currentTab.nodes.activeId]
}
getters.activeLink = (state, getters) => {
  let currentTab = getters.currentTab

  if (currentTab == null)
    return null

  let currentModule = getters.getModule(currentTab.moduleId)

  return currentModule.links[currentTab.links.activeId]
}




// Actions

export const actions = {}

actions.nuxtServerInit = function (context) {
  this.commit('resetProject')
}