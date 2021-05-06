const nodeTypes = {}




nodeTypes['table'] = {
  category: 'data',
  
  numInputs: 0,
  hasOutput: true,

  description: 'Table',

  props: {
    tableName: '',
  },
}
nodeTypes['node'] = {
  category: 'data',
  
  numInputs: 0,
  hasOutput: true,

  description: 'Node',

  props: {
    nodeName: '',
  },
}
nodeTypes['sql'] = {
  category: 'data',
  
  numInputs: 0,
  hasOutput: true,

  description: 'Sql',

  props: {
    sql: '',
  },
}




nodeTypes['union'] = {
  category: 'set-operations',

  numInputs: 2,
  hasOutput: true,

  description: 'Union',

  props: {
    allowDuplicates: false,
  },
}
nodeTypes['difference'] = {
  category: 'set-operations',

  numInputs: 2,
  hasOutput: true,

  description: 'Difference',

  props: {
  },
}
nodeTypes['intersection'] = {
  category: 'set-operations',

  numInputs: 2,
  hasOutput: true,

  description: 'Intersection',

  props: {
  },
}




nodeTypes['inner-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  description: 'Inner join',

  props: {
    condition: '',
  },
}
nodeTypes['left-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  description: 'Left join',

  props: {
    condition: '',
  },
}
nodeTypes['right-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  description: 'Right join',

  props: {
    condition: '',
  },
}
nodeTypes['full-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  description: 'Full join',

  props: {
    condition: '',
  },
}
nodeTypes['cross-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  description: 'Cross join',

  props: {
  },
}




nodeTypes['filter'] = {
  category: 'processing',
  
  numInputs: 1,
  hasOutput: true,

  description: 'Filter',

  props: {
    condition: '',
  },
}
nodeTypes['transform'] = {
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
}
nodeTypes['distinct'] = {
  category: 'processing',
  
  numInputs: 1,
  hasOutput: true,

  description: 'Distinct',

  props: {
    columns: '',
  },
}
nodeTypes['sort'] = {
  category: 'processing',
  
  numInputs: 1,
  hasOutput: true,

  description: 'Sort',

  props: {
    columns: '',
  },
}
nodeTypes['limit'] = {
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
}



export default nodeTypes