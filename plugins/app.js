import sql from './sql/sql.js'
import columnTracking from './column-tracking.js'



global._app = {}



_app.columnTracking = columnTracking



_app.sql = sql



_app.databases = [
  { text: 'Oracle', value: 'oracle' },
  { text: 'MySQL', value: 'mysql' },
  { text: 'MS SQL Server', value: 'ms-sql-server' },
  { text: 'PostgreSQL', value: 'postgres' },
]
  


_app.nodeTypes = {
  'table': {
    category: 'data',
    
    numInputs: 0,
    hasOutput: true,

    description: 'Table',

    props: {
      tableName: '',
    },
  },
  'node': {
    category: 'data',
    
    numInputs: 0,
    hasOutput: true,

    description: 'Node',

    props: {
      nodeName: '',
    },
  },
  'sql': {
    category: 'data',
    
    numInputs: 0,
    hasOutput: true,

    description: 'Sql',

    props: {
      sql: '',
    },
  },
  
  
  'union': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Union',

    props: {
      allowDuplicates: false,
    },
  },
  'difference': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Difference',

    props: {
      allowDuplicates: false,
    },
  },
  'intersection': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Intersection',

    props: {
      allowDuplicates: false,
    },
  },
  
  
  'inner-join': {
    category: 'joins',

    numInputs: 2,
    hasOutput: true,

    description: 'Inner join',

    props: {
      condition: '',
    },
  },
  'left-join': {
    category: 'joins',

    numInputs: 2,
    hasOutput: true,

    description: 'Left join',

    props: {
      condition: '',
    },
  },
  'right-join': {
    category: 'joins',

    numInputs: 2,
    hasOutput: true,

    description: 'Right join',

    props: {
      condition: '',
    },
  },
  'full-join': {
    category: 'joins',

    numInputs: 2,
    hasOutput: true,

    description: 'Full join',

    props: {
      condition: '',
    },
  },
  'cross-join': {
    category: 'joins',

    numInputs: 2,
    hasOutput: true,

    description: 'Cross join',

    props: {
      condition: '',
    },
  },
  
  
  'filter': {
    category: 'processing',
    
    numInputs: 1,
    hasOutput: true,

    description: 'Filter',

    props: {
      condition: '',
    },
  },
  'transform': {
    category: 'processing',
    
    numInputs: 1,
    hasOutput: true,

    description: 'Transform',

    props: {
      group: {
        active: false,
        columns: '',
        condition: '',
      },
      
      columns: '',
    },
  },
  'distinct': {
    category: 'processing',
    
    numInputs: 1,
    hasOutput: true,

    description: 'Distinct',

    props: {
      columns: '',
    },
  },
  'sort': {
    category: 'processing',
    
    numInputs: 1,
    hasOutput: true,

    description: 'Sort',

    props: {
      columns: '',
    },
  },
  'limit': {
    category: 'processing',

    numInputs: 1,
    hasOutput: true,

    description: 'Limit',

    props: {
      offset: '',

      limit: {
        value: '',
      },
    },
  },
}



_app.minZoom = Math.pow(1 / 1.2, 16)
_app.maxZoom = Math.pow(1.2, 12)



_app.socketOffset = { x: 34, y: 12 }



_app.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
_app.shallowCopy = (obj) => {
  if (Array.isArray(obj))
    return obj.slice()

  if (obj != null && obj.constructor == Object)
    return Object.assign({}, obj)

  return obj
}
_app.notSoShallowCopy = (obj) => {
  let result = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj))
    result[key] = _app.shallowCopy(value)

  return result
}



_app.getDisplayElem = function (tabId) {
  return document.getElementById(`display-${tabId}`)
}
_app.getDisplayRect = function (tabId) {
  return _app.getDisplayElem(tabId).getBoundingClientRect()
}

_app.getPointerPos = function (tabId, event) {
  let tabRect = _app.getDisplayRect(tabId)
  
  return {
    x: event.clientX - tabRect.x,
    y: event.clientY - tabRect.y
  }
}


_app.worldToScreen = function (tab, worldPos) {
  let tabRect = _app.getDisplayRect(tab.id)

  return {
    x: tabRect.width / 2 + (worldPos.x - tab.camera.pos.x) * tab.camera.zoom,
    y: tabRect.height / 2 + (worldPos.y - tab.camera.pos.y) * tab.camera.zoom,
  }
}
_app.screenToWorld = function (tab, screenPos) {
  let tabRect = _app.getDisplayRect(tab.id)

  return {
    x: tab.camera.pos.x + (screenPos.x - tabRect.width / 2) / tab.camera.zoom,
    y: tab.camera.pos.y + (screenPos.y - tabRect.height / 2) / tab.camera.zoom,
  }
}




export default (context, inject) => {
  inject('app', _app)
}