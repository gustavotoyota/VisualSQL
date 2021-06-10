global._app = {}
  




// Node types

import nodeTypes from './node-types.js'

_app.nodeTypes = nodeTypes





// SQL

import databases from './databases/databases.js'

_app.databases = databases





// Column tracking

import columnTracking from './column-tracking.js'

_app.columnTracking = columnTracking






// Save/Load

_app.createProjectBlob = function () {
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

_app.loadProject = function (projectStr) {
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

_app.tryUpdateProjectFile = async function () {
  if (_store.state.saving.fileHandle == null)
    return



  try {
    const writable = await _store.state.saving.fileHandle.createWritable()

    await writable.write(_app.createProjectBlob())

    await writable.close()

    

    _store.state.saving.modified = false
  } catch {
  }
}






// Settings

_app.minZoom = Math.pow(1 / 1.2, 16)
_app.maxZoom = Math.pow(1.2, 12)





_app.socketOffset = { x: 34, y: 12 }





export default (context, inject) => inject('app', _app)