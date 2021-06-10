const saveLoad = {}
export default saveLoad





// Load

saveLoad.loadProject = function (projectStr) {
  // Load project

  _store.state.project = JSON.parse(projectStr)



  // Rerender tabs

  _store.state.tabs.rerender++



  // Initialize undo/redo states

  for (const tab of _store.state.project.tabs)
    _store.commit('saveState', tab)



  // Initialize saving state

  _store.state.saving.ignoreChange = true
  _store.state.saving.modified = false
}





// Save

saveLoad.createProjectBlob = function () {
  const project = _utils.deepCopy(_store.state.project)

  for (const tab of project.tabs) {
    tab.undoRedo = {
      states: [],
      currentStateIdx: -1,
    }
  }
  
  return new Blob(
    [JSON.stringify(project, null, 2)],
    { type: 'application/json' })
}
saveLoad.tryUpdateProjectFile = async function () {
  if (_store.state.saving.fileHandle == null)
    return



  try {
    const writable = await _store.state.saving.fileHandle.createWritable()

    await writable.write(saveLoad.createProjectBlob())

    await writable.close()

    

    _store.state.saving.modified = false
  } catch {
  }
}