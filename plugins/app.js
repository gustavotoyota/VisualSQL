global._app = {}


_app.socketOffset = { x: 34, y: 12 }
  


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
  'module': {
    category: 'data',
    
    numInputs: 0,
    hasOutput: true,

    description: 'Module',

    props: {
      moduleName: '',
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
  
  
  'union-all': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Union all',

    props: {},
  },
  'union': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Union',

    props: {},
  },
  'except': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Except',

    props: {},
  },
  'intersect': {
    category: 'set-operations',

    numInputs: 2,
    hasOutput: true,

    description: 'Intersect',

    props: {},
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
      condition: '',
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
  'reduce': {
    category: 'processing',

    numInputs: 1,
    hasOutput: true,

    description: 'Reduce',

    props: {
      offset: '',
      limit: '',
    },
  },
  
  
  'pivot': {
    category: 'pivot',

    numInputs: 1,
    hasOutput: true,

    description: 'Pivot',

    props: {
      columns: '',
    },
  },
  
  
  'output': {
    category: 'output',

    numInputs: 1,
    hasOutput: false,

    description: 'Output',

    props: {},
  },
}



_app.getTabRect = function (tabId) {
  return document.getElementById(`display-${tabId}`).getBoundingClientRect()
}

_app.getPointerPos = function (tabId, event) {
  let tabRect = _app.getTabRect(tabId)
  
  return {
    x: event.clientX - tabRect.x,
    y: event.clientY - tabRect.y
  }
}


_app.worldToScreen = function (tab, worldPos) {
  let tabRect = _app.getTabRect(tab.id)

  return {
    x: tabRect.width / 2 + (worldPos.x - tab.camera.pos.x) * tab.camera.zoom,
    y: tabRect.height / 2 + (worldPos.y - tab.camera.pos.y) * tab.camera.zoom,
  }
}
_app.screenToWorld = function (tab, screenPos) {
  let tabRect = _app.getTabRect(tab.id)

  return {
    x: tab.camera.pos.x + (screenPos.x - tabRect.width / 2) / tab.camera.zoom,
    y: tab.camera.pos.y + (screenPos.y - tabRect.height / 2) / tab.camera.zoom,
  }
}



export default (context, inject) => {
  inject('app', _app)
}