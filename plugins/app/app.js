global._app = {}
  




// Save/load

import saveLoad from './save-load.js'

_app.saveLoad = saveLoad





// Node types

import nodeTypes from './node-types.js'

_app.nodeTypes = nodeTypes





// Column tracking

import columnTracking from './column-tracking.js'

_app.columnTracking = columnTracking





// SQL

import databases from './databases/databases.js'

_app.databases = databases





// Settings

_app.minZoom = Math.pow(1 / 1.2, 16)
_app.maxZoom = Math.pow(1.2, 12)





_app.socketOffset = { x: 34, y: 12 }





export default (context, inject) => inject('app', _app)