const saveLoad = {}
export default saveLoad





// Load

saveLoad.loadProject = function (projectStr) {
  // Load project

  $state.project = JSON.parse(projectStr)



  // Rerender tabs

  $state.tabs.rerender++



  // Initialize undo/redo states

  for (const tab of $state.project.tabs.list)
    $commit('saveState', tab)



  // Initialize saving state

  $state.saving.ignoreNextChange = true
  $state.saving.modified = false
}





// Save

saveLoad.createProjectBlob = function () {
  const project = $utils.deepCopy($state.project)

  for (const tab of project.tabs.list) {
    tab.states = {
      currentIdx: -1,
      list: [],
    }
  }
  
  return new Blob(
    [JSON.stringify(project, null, 2)],
    { type: 'application/json' })
}
saveLoad.tryUpdateProjectFile = async function () {
  if ($state.saving.fileHandle == null)
    return



  try {
    const writable = await $state.saving.fileHandle.createWritable()

    await writable.write(saveLoad.createProjectBlob())

    await writable.close()

    

    $state.saving.modified = false
  } catch (err) {
    console.log(err)
    
    $state.saving.fileHandle = null
  }
}