const getters = {}
export default getters


  

getters.getModuleIdx = (state) => (moduleId) => {
  return state.project.modules.list.findIndex(module => module.id === moduleId)
}
getters.getModule = (state, getters) => (moduleId) => {
  return state.project.modules.list[getters.getModuleIdx(moduleId)]
}




getters.getTableIdx = (state) => (tableId) => {
  return state.project.tables.list.findIndex(table => table.id === tableId)
}
getters.getTable = (state, getters) => (tableId) => {
  return state.project.tables.list[getters.getTableIdx(tableId)]
}




getters.getTabIdx = (state) => (tabId) => {
  return state.project.tabs.list.findIndex(tab => tab.id === tabId)
}
getters.getTab = (state, getters) => (tabId) => {
  return state.project.tabs.list[getters.getTabIdx(tabId)]
}




getters.getModuleTabIdx = (state) => (moduleId) => {
  return state.project.tabs.list.findIndex(tab => tab.moduleId === moduleId)
}
getters.getModuleTab = (state, getters) => (moduleId) => {
  return state.project.tabs.list[getters.getModuleTabIdx(moduleId)]
}




getters.currentTab = (state, getters) => {
  return getters.getTab(state.project.tabs.currentId)
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

  return currentModule.data.nodes.map[currentTab.nodes.activeId]
}
getters.activeLink = (state, getters) => {
  let currentTab = getters.currentTab

  if (currentTab == null)
    return null

  let currentModule = getters.getModule(currentTab.moduleId)

  return currentModule.data.links.map[currentTab.links.activeId]
}






getters.getDisplayElem = (state, getters) => () => {
  return document.getElementById(`display-${state.project.tabs.currentId}`)
}
getters.getDisplayRect = (state, getters) => () => {
  return getters.getDisplayElem().getBoundingClientRect()
}





getters.getDisplayPos = (state, getters) => (event) => {
  let displayRect = getters.getDisplayRect()
  
  return {
    x: event.pageX - displayRect.left,
    y: event.pageY - displayRect.top
  }
}




getters.worldToScreen = (state, getters) => (module, worldPos) => {
  let displayRect = getters.getDisplayRect()

  return {
    x: displayRect.width / 2 + (worldPos.x - module.camera.pos.x) * module.camera.zoom,
    y: displayRect.height / 2 + (worldPos.y - module.camera.pos.y) * module.camera.zoom,
  }
}
getters.screenToWorld = (state, getters) => (module, screenPos) => {
  let displayRect = getters.getDisplayRect()

  return {
    x: module.camera.pos.x + (screenPos.x - displayRect.width / 2) / module.camera.zoom,
    y: module.camera.pos.y + (screenPos.y - displayRect.height / 2) / module.camera.zoom,
  }
}




getters.currentDatabase = () => {
  return $app.databases.data[$state.project.sql.database]
}
getters.getCurrentColumns = () => () => {
  const columnObjs = $getters.currentDatabase.generateTree(
    $getters.currentModule, $getters.activeNode).columnObjs



  // Check number of tables

  const tableSet = {}
  for (const columnObj of columnObjs)
    tableSet[columnObj.table ?? ''] = true



  // Get columns

  const columns = []

  if (Object.keys(tableSet).length === 1) {
    for (const columnObj of columnObjs)
      columns.push(columnObj.column)
  } else {
    for (const columnObj of columnObjs) {
      if (columnObj.table)
        columns.push(`${columnObj.table}.${columnObj.column}`)
      else
        columns.push(columnObj.column)
    }
  }



  return columns
}