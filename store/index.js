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



  cutSelectedNodes(state) {
    this.commit('copySelectedNodes')
    this.commit('deleteSelectedNodes')
  },
  copySelectedNodes(state) {
    let tab = this.getters.currentTab

    if (tab == null) {
      state.clipboard = null
      return
    }




    // Calculate center position

    let centerPos = { x: 0, y: 0 }

    let selectedNodes = Object.values(tab.nodes.selected)

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
      for (let link of node.incomingLinks.concat(
      Object.values(node.outgoingLinks))) {
        if (link == null)
          continue

        if (link.id in linkMap)
          continue

        if (!(link.from in tab.nodes.selected))
          continue

        if (!(link.to in tab.nodes.selected))
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
        }
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
        }
      })

      module.nodes[firstNodeId + link.from].outgoingLinks[linkId] = module.links[linkId]
      module.nodes[firstNodeId + link.to].incomingLinks[link.socket] = module.links[linkId]
    }



    tab.nodes.selected = {}
    for (let nodeId = firstNodeId; nodeId < module.nextNodeId; ++nodeId)
      Vue.set(tab.nodes.selected, nodeId, module.nodes[nodeId])

    tab.nodes.active = module.nodes[firstNodeId]
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