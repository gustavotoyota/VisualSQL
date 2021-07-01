import Vue from 'vue'




const mutations = {}
export default mutations




// Project
  
mutations.resetProject = function () {
  // Initialize saving state

  $state.saving.ignoreChange = $state.project != null
  $state.saving.modified = false

  $state.saving.fileHandle = null



  $state.project = {
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
      database: 'oracle',

      uppercaseKeywords: true,

      indentWithSpaces: true,
      indentSize: 2,
    },
  }


  
  $state.tabs.rerender++



  $commit('createModule', 'module1')
}
  




// Modules

mutations.createModule = function (state, moduleName) {
  if (!checkModuleName(moduleName))
    return



  const module = {
    id: $state.project.modules.nextId++,

    name: moduleName,

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

  $state.project.modules.list.push(module)



  $commit('createTab', module.id)
}
mutations.editModule = function (state, payload) {
  if (!checkModuleName(payload.data.name, payload.moduleId))
    return


  
  const module = $getters.getModule(payload.moduleId)

  $utils.merge(module, payload.data)
}
mutations.deleteModule = function (state, moduleId) {
  let moduleTab = $getters.getModuleTab(moduleId)

  if (moduleTab != null)
    $commit('closeTab', moduleTab.id)

  $state.project.modules.list.splice($getters.getModuleIdx(moduleId), 1)
}

function checkModuleName(moduleName, moduleId) {
  // Check for invalid module name

  if (moduleName === '') {
    $commit('showSnackbar', {
      text: 'Invalid module name',
      color: 'red',
      timeout: 3000,
    })

    return false
  }



  // Check for existing module name

  let module = $state.project.modules.list.find(
    (module) => module.name === moduleName)

  if (module != null && module.id !== moduleId) {
    $commit('showSnackbar', {
      text: 'A module with this name already exists',
      color: 'red',
      timeout: 3000,
    })

    return false
  }



  return true
}





// Tables

mutations.createTable = function (state, payload) {
  if (!checkTableName(payload.name))
    return

    

  $state.project.tables.list.push({
    id: $state.project.tables.nextId++,

    name: payload.name,

    columns: payload.columns,
  })
}
mutations.editTable = function (state, payload) {
  if (!checkTableName(payload.data.name, payload.tableId))
    return

  
  
  const table = $getters.getTable(payload.tableId)

  $utils.merge(table, payload.data)
}
mutations.deleteTable = function (state, tableId) {
  $state.project.tables.list.splice(
    $getters.getTableIdx(tableId), 1)
}

function checkTableName(tableName, tableId) {
  // Check for invalid module name

  if (tableName === '') {
    $commit('showSnackbar', {
      text: 'Invalid table name',
      color: 'red',
      timeout: 3000,
    })

    return false
  }



  // Check for existing module name

  const table = $state.project.tables.list.find(
    (table) => table.name === tableName)

  if (table != null && table.id !== tableId) {
    $commit('showSnackbar', {
      text: 'A table with this name already exists',
      color: 'red',
      timeout: 3000,
    })

    return false
  }



  return true
}





// Tabs

mutations.createTab = function (state, moduleId) {
  let moduleTab = $getters.getModuleTab(moduleId)

  if (moduleTab == null) {
    moduleTab = {
      id: $state.project.tabs.nextId++,

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

    $state.project.tabs.list.push(moduleTab)
  }

  $state.project.tabs.currentId = moduleTab.id
  
  if (moduleTab.states.currentIdx < 0)
    $commit('saveState')
}
mutations.closeTab = function (state, tabId) {
  $state.project.tabs.list.splice($getters.getTabIdx(tabId), 1)
}





// Nodes

mutations.createNode = function (state, payload) {
  let module = $getters.getModule(payload.moduleId)


  
  let nodeTypeInfo = $app.nodeTypes[payload.node.type]

  let node = {
    id: module.data.nodes.nextId++,

    pos: { x: 0, y: 0 },

    props: {
      name: '',
      common: false,

      description: '',
    },
  }

  

  node.incomingLinks = new Array(nodeTypeInfo.numInputs)
  node.outgoingLinks = {}



  $utils.merge(node.props, nodeTypeInfo.props)
  $utils.merge(node, payload.node)



  Vue.set(module.data.nodes.map, node.id, node)



  if (!payload.dontActivate)
    $commit('activateNode', node.id)

  

  if (!payload.dontSaveState)
    $commit('saveState')
}
mutations.deleteNode = function (state, payload) {
  let module = $getters.getModule(payload.moduleId)

  let node = module.data.nodes.map[payload.nodeId]

  for (let linkId of node.incomingLinks) {
    if (linkId == null)
      continue

    $commit('deleteLink', {
      moduleId: module.id,
      linkId: linkId,

      dontSaveState: true,
    })
  }

  for (let linkId of Object.keys(node.outgoingLinks)) {
    $commit('deleteLink', {
      moduleId: module.id,
      linkId: linkId,

      dontSaveState: true,
    })
  }

  Vue.delete(module.data.nodes.map, node.id)

  if (!payload.dontSaveState)
    $commit('saveState')
}





// Links

mutations.createLink = function (state, payload) {
  // Create link

  let module = $getters.getModule(payload.moduleId)

  let link = $utils.merge({
    id: module.data.links.nextId++,

    props: {
      alias: '',
    },
  }, payload.link)




  // Delete existing link

  let existingLinkId = module.data.nodes.map[link.to].incomingLinks[link.socket]

  if (existingLinkId != null) {
    link.props = $utils.deepCopy(module.data.links.map[existingLinkId].props)

    $commit('deleteLink', {
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
    $commit('activateLink', link.id)


  if (!payload.dontSaveState)
    $commit('saveState')
}
mutations.deleteLink = function (state, payload) {
  let module = $getters.getModule(payload.moduleId)

  let link = module.data.links.map[payload.linkId]

  Vue.delete(module.data.nodes.map[link.from].outgoingLinks, link.id)
  Vue.set(module.data.nodes.map[link.to].incomingLinks, link.socket, null)

  Vue.delete(module.data.links.map, link.id)


  
  if (!payload.dontSaveState)
    $commit('saveState')
}





// Selection

mutations.clearSelection = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return


    
  tab.nodes.selected = {}
  tab.nodes.activeId = null
  
  tab.links.selected = {}
  tab.links.activeId = null
}
mutations.selectAll = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)
    


  tab.nodes.selected = {}
  for (let node of Object.values(module.data.nodes.map))
    Vue.set(tab.nodes.selected, node.id, true)
    
  tab.links.selected = {}
  for (let link of Object.values(module.data.links.map))
    Vue.set(tab.links.selected, link.id, true)
}





mutations.activateNode = function (state, nodeId) {
  let tab = $getters.currentTab

  if (tab == null)
    return



  $commit('clearSelection')

  Vue.set(tab.nodes.selected, nodeId, true)
  
  tab.nodes.activeId = nodeId
}
mutations.activateLink = function (state, linkId) {
  let tab = $getters.currentTab

  if (tab == null)
    return


    
  $commit('clearSelection')

  Vue.set(tab.links.selected, linkId, true)
  
  tab.links.activeId = linkId
}





mutations.deleteSelection = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

    
    
  for (let linkId of Object.keys(tab.links.selected)) {
    $commit('deleteLink', {
      moduleId: tab.moduleId,
      linkId: linkId,

      dontSaveState: true,
    })
  }

  for (let nodeId of Object.keys(tab.nodes.selected)) {
    $commit('deleteNode', {
      moduleId: tab.moduleId,
      nodeId: nodeId,

      dontSaveState: true,
    })
  }



  $commit('clearSelection')
  $commit('saveState')
}





// Copy/paste

mutations.cutSelection = function () {
  $commit('copySelection')
  $commit('deleteSelection')
}
mutations.copySelection = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)
  


  
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

  

  $utils.writeToClipboard(JSON.stringify({
    nodes: nodes,
    links: links,
  }, null, 2))
}
mutations.paste = async function (state, clipboardText) {
  // Get clipboard text

  clipboardText = clipboardText || await $utils.readFromClipboard()

  if (clipboardText === '')
    return


    
    
  // Get clipboard object

  let clipboardObj

  try {
    clipboardObj = JSON.parse(clipboardText)
  } catch (err) {
    console.log(err)
    
    return
  }




  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)

  


  let firstNodeId = module.data.nodes.nextId
  let firstLinkId = module.data.links.nextId




  // Paste nodes

  for (let node of clipboardObj.nodes) {
    $commit('createNode', {
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

  for (let link of clipboardObj.links) {
    let linkId = module.data.links.nextId

    $commit('createLink', {
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



  
  $commit('saveState')
}




// Camera

mutations.fitToScreen = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)





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

  let displayRect = $getters.getDisplayRect()

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
  tab = tab || $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)


  

  let moduleState = $utils.deepCopy(module.data)
  
  tab.states.list.splice(++tab.states.currentIdx)
  tab.states.list.push(JSON.stringify(moduleState))
}
mutations.replaceState = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)


  

  let moduleState = $utils.deepCopy(module.data)
  
  tab.states.list.splice(tab.states.currentIdx)
  Vue.set(tab.states.list, tab.states.currentIdx, JSON.stringify(moduleState))
}




mutations.undo = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)




  if (tab.states.currentIdx === 0)
    return

  $commit('clearSelection')

  module.data = JSON.parse(tab.states.list[--tab.states.currentIdx])
}
mutations.redo = function () {
  let tab = $getters.currentTab

  if (tab == null)
    return

  let module = $getters.getModule(tab.moduleId)




  if (tab.states.currentIdx === tab.states.list.length - 1)
    return

  $commit('clearSelection')
  
  module.data = JSON.parse(tab.states.list[++tab.states.currentIdx])
}




// Snackbar

mutations.showSnackbar = function (state, payload) {
  $state.snackbar.text = payload.text
  $state.snackbar.color = payload.color
  $state.snackbar.timeout = payload.timeout

  $state.snackbar.active = true

  clearTimeout($state.snackbar.timeoutId)
  
  $state.snackbar.timeoutId = setTimeout(() => {
    $state.snackbar.active = false
  }, payload.timeout)
}