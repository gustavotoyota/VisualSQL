import Vue from 'vue'




const mutations = {}
export default mutations




// Project
  
mutations.resetProject = function (state) {
  // Initialize saving state

  state.saving.ignoreChange = state.project != null
  state.saving.modified = false

  state.saving.fileHandle = null



  state.project = {
    // Modules

    modules: {
      nextId: 0,
      list: [],
    },




    // Tables

    tables: {
      nextId: 0,
      list: [],
    },




    // Tabs
    
    tabs: {
      currentId: 0,
      nextId: 0,
      list: [],
    },




    // SQL

    sql: {
      database: 'postgres',

      uppercaseKeywords: true,

      indentWithSpaces: true,
      indentSize: 2,
    },
  }


  
  state.tabs.rerender++



  this.commit('createModule', 'module_1')
}
  




// Modules

mutations.createModule = function (state, name) {
  let module = state.project.modules.list.find(module => module.name === name)

  if (module != null || name === '')
    return



  module = {
    id: state.project.modules.nextId++,

    name: name,

    data: {
      nodes: {
        nextId: 0,
        map: {},
      },

      links: {
        nextId: 0,
        map: {},
      },
    },

    camera: {
      pos: { x: 0, y: 0 },
      zoom: 1,
    },
  }

  state.project.modules.list.push(module)



  this.commit('createTab', module.id)
}
mutations.deleteModule = function (state, moduleId) {
  let moduleTab = this.getters.getModuleTab(moduleId)

  if (moduleTab != null)
    this.commit('closeTab', moduleTab.id)

  state.project.modules.list.splice(this.getters.getModuleIdx(moduleId), 1)
}





// Tables

mutations.createTable = function (state, payload) {
  let table = state.project.tables.list.find(table => table.name === payload.name)

  if (table != null || payload.name === '')
    return

    

  state.project.tables.list.push({
    id: state.project.tables.nextId++,

    name: payload.name,

    columns: payload.columns,
  })
}
mutations.deleteTable = function (state, tableId) {
  state.project.tables.list.splice(
    this.getters.getTableIdx(tableId), 1)
}





// Tabs

mutations.createTab = function (state, moduleId) {
  let moduleTab = this.getters.getModuleTab(moduleId)

  if (moduleTab == null) {
    moduleTab = {
      id: state.project.tabs.nextId++,

      moduleId: moduleId,

      nodes: {
        activeId: null,
        selected: {},
      },

      links: {
        activeId: null,
        selected: {},
      },
      
      states: {
        currentIdx: -1,
        list: [],
      },
    }

    state.project.tabs.list.push(moduleTab)
  }

  state.project.tabs.currentId = moduleTab.id
  
  if (moduleTab.states.currentIdx < 0)
    this.commit('saveState')
}
mutations.closeTab = function (state, tabId) {
  state.project.tabs.list.splice(this.getters.getTabIdx(tabId), 1)
}





// Nodes

mutations.createNode = function (state, payload) {
  let module = this.getters.getModule(payload.moduleId)


  
  let nodeTypeInfo = $app.nodeTypes[payload.node.type]

  let node = {
    id: module.data.nodes.nextId++,

    pos: { x: 0, y: 0 },

    props: {
      name: '',
      description: '',
    },
  }

  

  node.incomingLinks = new Array(nodeTypeInfo.numInputs)
  node.outgoingLinks = {}



  Object.assign(node.props, $utils.deepCopy(nodeTypeInfo.props))
  Object.assign(node, payload.node)



  Vue.set(module.data.nodes.map, node.id, node)



  if (!payload.dontActivate)
    this.commit('activateNode', node.id)

  

  if (!payload.dontSaveState)
    this.commit('saveState')
}
mutations.deleteNode = function (state, payload) {
  let module = this.getters.getModule(payload.moduleId)

  let node = module.data.nodes.map[payload.nodeId]

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

  Vue.delete(module.data.nodes.map, node.id)

  if (!payload.dontSaveState)
    this.commit('saveState')
}





// Links

mutations.createLink = function (state, payload) {
  // Create link

  let module = this.getters.getModule(payload.moduleId)

  let link = Object.assign({
    id: module.data.links.nextId++,

    props: {
      alias: '',
    },
  }, payload.link)




  // Delete existing link

  let existingLinkId = module.data.nodes.map[link.to].incomingLinks[link.socket]

  if (existingLinkId != null) {
    link.props = $utils.deepCopy(module.data.links.map[existingLinkId].props)

    this.commit('deleteLink', {
      moduleId: module.id,
      linkId: existingLinkId,

      dontSaveState: true,
    })
  }


  

  // Setup link references

  Vue.set(module.data.nodes.map[link.from].outgoingLinks, link.id, true)
  Vue.set(module.data.nodes.map[link.to].incomingLinks, link.socket, link.id)

  Vue.set(module.data.links.map, link.id, link)



  if (!payload.dontActivate)
    this.commit('activateLink', link.id)


  if (!payload.dontSaveState)
    this.commit('saveState')
}
mutations.deleteLink = function (state, payload) {
  let module = this.getters.getModule(payload.moduleId)

  let link = module.data.links.map[payload.linkId]

  Vue.delete(module.data.nodes.map[link.from].outgoingLinks, link.id)
  Vue.set(module.data.nodes.map[link.to].incomingLinks, link.socket, null)

  Vue.delete(module.data.links.map, link.id)


  
  if (!payload.dontSaveState)
    this.commit('saveState')
}





// Selection

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
  for (let node of Object.values(module.data.nodes.map))
    Vue.set(tab.nodes.selected, node.id, true)
    
  tab.links.selected = {}
  for (let link of Object.values(module.data.links.map))
    Vue.set(tab.links.selected, link.id, true)
}





mutations.activateNode = function (state, nodeId) {
  let tab = this.getters.currentTab

  if (tab == null)
    return



  this.commit('clearSelection')

  Vue.set(tab.nodes.selected, nodeId, true)
  
  tab.nodes.activeId = nodeId
}
mutations.activateLink = function (state, linkId) {
  let tab = this.getters.currentTab

  if (tab == null)
    return


    
  this.commit('clearSelection')

  Vue.set(tab.links.selected, linkId, true)
  
  tab.links.activeId = linkId
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





// Copy/paste

mutations.cutSelection = function (state) {
  this.commit('copySelection')
  this.commit('deleteSelection')
}
mutations.copySelection = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)
  


  
  // Gather selected nodes

  let selectedNodes = []
  for (let nodeId of Object.keys(tab.nodes.selected))
    selectedNodes.push(module.data.nodes.map[nodeId])

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

      props: $utils.deepCopy(node.props),
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

      if (linkId in linkMap)
        continue

      let link = module.data.links.map[linkId]

      if (!(link.from in tab.nodes.selected))
        continue

      if (!(link.to in tab.nodes.selected))
        continue
      
      linkMap[link.id] = links.length

      links.push({
        from: nodeMap[link.from],
        to: nodeMap[link.to],
        socket: link.socket,

        props: $utils.deepCopy(link.props),
      })
    }
  }




  state.clipboard.value = {
    nodes: nodes,
    links: links,
  }
}
mutations.paste = function (state) {
  if (state.clipboard.value == null)
    return




  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)

  


  let firstNodeId = module.data.nodes.nextId
  let firstLinkId = module.data.links.nextId




  // Paste nodes

  for (let node of state.clipboard.value.nodes) {
    this.commit('createNode', {
      moduleId: module.id,

      node: {
        type: node.type,

        pos: {
          x: module.camera.pos.x + node.pos.x,
          y: module.camera.pos.y + node.pos.y,
        },

        props: $utils.deepCopy(node.props),
      },

      dontActivate: true,
      dontSaveState: true,
    })
  }




  // Paste links

  for (let link of state.clipboard.value.links) {
    let linkId = module.data.links.nextId

    this.commit('createLink', {
      moduleId: module.id,

      link: {
        from: firstNodeId + link.from,
        to: firstNodeId + link.to,
        socket: link.socket,

        props: $utils.deepCopy(link.props),
      },

      dontActivate: true,
      dontSaveState: true,
    })

    Vue.set(module.data.nodes.map[firstNodeId + link.from].outgoingLinks, linkId, true)
    Vue.set(module.data.nodes.map[firstNodeId + link.to].incomingLinks, link.socket, linkId)
  }




  // Select pasted objects

  tab.nodes.selected = {}
  for (let nodeId = firstNodeId; nodeId < module.data.nodes.nextId; ++nodeId)
    Vue.set(tab.nodes.selected, nodeId, true)

  tab.links.selected = {}
  for (let linkId = firstLinkId; linkId < module.data.links.nextId; ++linkId)
    Vue.set(tab.links.selected, linkId, true)

  tab.nodes.activeId = firstNodeId
  tab.links.activeId = null



  
  this.commit('saveState')
}




// Camera

mutations.fitToScreen = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)





  // Gather selected object positions

  const positions = []

  for (const nodeId in tab.nodes.selected)
    positions.push(module.data.nodes.map[nodeId].pos)

  for (const linkId in tab.links.selected){
    const link = module.data.links.map[linkId]

    const srcNode = module.data.nodes.map[link.from]
    const destNode = module.data.nodes.map[link.to]
    
    positions.push({
      x: (srcNode.pos.x + destNode.pos.x) / 2,
      y: (srcNode.pos.y + destNode.pos.y) / 2,
    })
  }





  // No objects selected: gather all object positions

  if (positions.length === 0) {
    for (const node of Object.values(module.data.nodes.map))
      positions.push(node.pos)

    for (const link of Object.values(module.data.links.map)) {
      const srcNode = module.data.nodes.map[link.from]
      const destNode = module.data.nodes.map[link.to]

      positions.push({
        x: (srcNode.pos.x + destNode.pos.x) / 2,
        y: (srcNode.pos.y + destNode.pos.y) / 2,
      })
    }
  }



  
  // Camera position

  let topLeft = { x: Infinity, y: Infinity }
  let bottomRight = { x: -Infinity, y: -Infinity }

  for (const pos of positions) {
    topLeft.x = Math.min(topLeft.x, pos.x)
    topLeft.y = Math.min(topLeft.y, pos.y)

    bottomRight.x = Math.max(bottomRight.x, pos.x)
    bottomRight.y = Math.max(bottomRight.y, pos.y)
  }

  module.camera.pos = {
    x: ((topLeft.x + bottomRight.x) / 2) || 0,
    y: ((topLeft.y + bottomRight.y) / 2) || 0,
  }




  // Camera zoom

  let displayRect = this.getters.getDisplayRect()

  module.camera.zoom = 1

  if (topLeft.x !== module.camera.pos.x && isFinite(topLeft.x))
    module.camera.zoom = Math.min(module.camera.zoom,
      (Math.min(150, displayRect.width / 4) - displayRect.width / 2) /
      (topLeft.x - module.camera.pos.x))

  if (topLeft.y !== module.camera.pos.y && isFinite(topLeft.y))
    module.camera.zoom = Math.min(module.camera.zoom,
      (Math.min(75, displayRect.height / 4) - displayRect.height / 2) /
      (topLeft.y - module.camera.pos.y))

  module.camera.zoom = Math.max(module.camera.zoom, $app.minZoom)
}





// Undo/redo

mutations.saveState = function (state, tab) {
  tab = tab || this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)


  

  let moduleState = $utils.deepCopy(module.data)
  
  tab.states.list.splice(++tab.states.currentIdx)
  tab.states.list.push(JSON.stringify(moduleState))
}
mutations.replaceState = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)


  

  let moduleState = $utils.deepCopy(module.data)
  
  tab.states.list.splice(tab.states.currentIdx)
  Vue.set(tab.states.list, tab.states.currentIdx, JSON.stringify(moduleState))
}




mutations.undo = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)




  if (tab.states.currentIdx === 0)
    return

  this.commit('clearSelection')

  module.data = JSON.parse(tab.states.list[--tab.states.currentIdx])
}
mutations.redo = function (state) {
  let tab = this.getters.currentTab

  if (tab == null)
    return

  let module = this.getters.getModule(tab.moduleId)




  if (tab.states.currentIdx === tab.states.list.length - 1)
    return

  this.commit('clearSelection')
  
  module.data = JSON.parse(tab.states.list[++tab.states.currentIdx])
}
