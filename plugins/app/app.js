global._app = {}





// Utils

import utils from './utils.js'

Object.assign(_app, utils)
  




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
  const project = _app.deepCopy($nuxt.$store.state.project)

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

_app.tryUpdateProjectFile = async function () {
  if ($nuxt.$store.state.saving.fileHandle == null)
    return



  try {
    const writable = await $nuxt.$store.state.saving.fileHandle.createWritable()

    await writable.write(_app.createProjectBlob())

    await writable.close()

    

    $nuxt.$store.state.saving.modified = false
  } catch {
  }
}






// Settings

_app.minZoom = Math.pow(1 / 1.2, 16)
_app.maxZoom = Math.pow(1.2, 12)





_app.socketOffset = { x: 34, y: 12 }





export default (context, inject) => inject('app', _app)