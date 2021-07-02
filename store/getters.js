const getters = {}
export default getters


  

getters.getModuleIdx = () => (moduleId) => {
  return $state.project.modules.list.findIndex(module => module.id === moduleId)
}
getters.getModule = () => (moduleId) => {
  return $state.project.modules.list[$getters.getModuleIdx(moduleId)]
}




getters.getTableIdx = () => (tableId) => {
  return $state.project.tables.list.findIndex(table => table.id === tableId)
}
getters.getTable = () => (tableId) => {
  return $state.project.tables.list[$getters.getTableIdx(tableId)]
}




getters.getTabIdx = () => (tabId) => {
  return $state.project.tabs.list.findIndex(tab => tab.id === tabId)
}
getters.getTab = () => (tabId) => {
  return $state.project.tabs.list[$getters.getTabIdx(tabId)]
}




getters.getModuleTabIdx = () => (moduleId) => {
  return $state.project.tabs.list.findIndex(tab => tab.moduleId === moduleId)
}
getters.getModuleTab = () => (moduleId) => {
  return $state.project.tabs.list[$getters.getModuleTabIdx(moduleId)]
}




getters.currentTab = () => {
  return $getters.getTab($state.project.tabs.currentId)
}
getters.currentModule = () => {
  const currentTab = $getters.currentTab

  if (currentTab == null)
    return null
    
  return $getters.getModule(currentTab.moduleId)
}




getters.activeNode = () => {
  const currentTab = $getters.currentTab

  if (currentTab == null)
    return null

    const currentModule = $getters.getModule(currentTab.moduleId)

  return currentModule.data.nodes.map[currentTab.nodes.activeId]
}
getters.activeLink = () => {
  const currentTab = $getters.currentTab

  if (currentTab == null)
    return null

    const currentModule = $getters.getModule(currentTab.moduleId)

  return currentModule.data.links.map[currentTab.links.activeId]
}






getters.getDisplayElem = () => () => {
  return document.getElementById(`display-${$state.project.tabs.currentId}`)
}
getters.getDisplayRect = () => () => {
  return $getters.getDisplayElem().getBoundingClientRect()
}





getters.getDisplayPos = () => (event) => {
  const displayRect = $getters.getDisplayRect()
  
  return {
    x: event.pageX - displayRect.left,
    y: event.pageY - displayRect.top
  }
}




getters.worldToScreen = () => (module, worldPos) => {
  const displayRect = $getters.getDisplayRect()

  return {
    x: displayRect.width / 2 + (worldPos.x - module.camera.pos.x) * module.camera.zoom,
    y: displayRect.height / 2 + (worldPos.y - module.camera.pos.y) * module.camera.zoom,
  }
}
getters.screenToWorld = () => (module, screenPos) => {
  const displayRect = $getters.getDisplayRect()

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