global.$app = {}
  




// Save/load

import saveLoad from './save-load.js'

$app.saveLoad = saveLoad





// Node types

import nodeTypes from './node-types.js'

$app.nodeTypes = nodeTypes





// Column tracking

import columnTracking from './column-tracking/column-tracking.js'

$app.columnTracking = columnTracking





// SQL

import databases from './databases/databases.js'

$app.databases = databases





// Settings

$app.minZoom = Math.pow(1 / 1.2, 16)
$app.maxZoom = Math.pow(1.2, 12)





$app.socketOffset = { x: 34, y: 12 }





export default (context, inject) => inject('app', $app)