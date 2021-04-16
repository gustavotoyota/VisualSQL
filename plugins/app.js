global._app = {}


_app.socketOffset = { x: 34, y: 12 }


_app.nodeGroups = {
  'data': {
    numInputs: 0,
    hasOutput: true,
  },
  'set-operations': {
    numInputs: 2,
    hasOutput: true,
  },
  'joins': {
    numInputs: 2,
    hasOutput: true,
  },
  'processing': {
    numInputs: 1,
    hasOutput: true,
  },
  'pivot': {
    numInputs: 1,
    hasOutput: true,
  },
  'output': {
    numInputs: 1,
    hasOutput: false,
  },
}
  


_app.nodeTypes = {
  'table': {
    group: 'data',

    props: {
      tableName: '',
    },
  },
  'module': {
    group: 'data',

    props: {
      moduleName: '',
    },
  },
  'node': {
    group: 'data',

    props: {
      nodeName: '',
    },
  },
  'sql': {
    group: 'data',

    props: {
      sql: '',
    },
  },
  
  
  'union-all': {
    group: 'set-operations',

    props: {},
  },
  'union': {
    group: 'set-operations',

    props: {},
  },
  'except': {
    group: 'set-operations',

    props: {},
  },
  'intersect': {
    group: 'set-operations',

    props: {},
  },
  
  
  'inner-join': {
    group: 'joins',

    props: {
      condition: '',
    },
  },
  'left-join': {
    group: 'joins',

    props: {
      condition: '',
    },
  },
  'right-join': {
    group: 'joins',

    props: {
      condition: '',
    },
  },
  'full-join': {
    group: 'joins',

    props: {
      condition: '',
    },
  },
  'cross-join': {
    group: 'joins',

    props: {
      condition: '',
    },
  },
  
  
  'filter': {
    group: 'processing',

    props: {
      condition: '',
    },
  },
  'transform': {
    group: 'processing',

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
    group: 'processing',

    props: {
      columns: '',
    },
  },
  'sort': {
    group: 'processing',

    props: {
      columns: '',
    },
  },
  'reduce': {
    group: 'processing',

    props: {
      offset: '',
      limit: '',
    },
  },
  
  
  'pivot': {
    group: 'pivot',

    props: {
      columns: '',
    },
  },
  
  
  'output': {
    group: 'output',

    props: {},
  },
}



_app.getTabRect = function (tabId) {
  return document.getElementById(`display-${tabId}`).getBoundingClientRect()
}

_app.getMousePos = function (tabId, event) {
  let rect = _app.getTabRect(tabId)
  
  return {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y
  }
}


_app.worldToScreen = function (tab, worldPos) {
  let rect = _app.getTabRect(tab.id)

  return {
    x: rect.width / 2 + (worldPos.x - tab.camera.pos.x) * tab.camera.zoom,
    y: rect.height / 2 + (worldPos.y - tab.camera.pos.y) * tab.camera.zoom,
  }
}
_app.screenToWorld = function (tab, screenPos) {
  let rect = _app.getTabRect(tab.id)

  return {
    x: tab.camera.pos.x + (screenPos.x - rect.width / 2) / tab.camera.zoom,
    y: tab.camera.pos.y + (screenPos.y - rect.height / 2) / tab.camera.zoom,
  }
}



export default (context, inject) => {
  inject('app', _app)
}