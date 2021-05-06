global._app = {}





// Utils

import utils from './utils.js'

Object.assign(_app, utils)
  




// Node types

import nodeTypes from './node-types.js'

_app.nodeTypes = nodeTypes





// SQL

import sql from './sql/sql.js'

_app.sql = sql





// Column tracking

import columnTracking from './column-tracking.js'

_app.columnTracking = columnTracking





// Settings

_app.minZoom = Math.pow(1 / 1.2, 16)
_app.maxZoom = Math.pow(1.2, 12)





_app.socketOffset = { x: 34, y: 12 }





_app.databases = [
  //{ text: 'Oracle', value: 'oracle' },
  { text: 'MySQL', value: 'mysql' },
  //{ text: 'MS SQL Server', value: 'ms-sql-server' },
  { text: 'PostgreSQL', value: 'postgres' },
]





export default (context, inject) => inject('app', _app)