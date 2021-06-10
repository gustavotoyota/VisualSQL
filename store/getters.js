const getters = {}
export default getters


  

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