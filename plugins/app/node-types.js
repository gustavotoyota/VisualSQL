const nodeTypes = {}




nodeTypes['table'] = {
  category: 'data',
  
  numInputs: 0,
  hasOutput: true,

  title: 'Table',

  props: {
    tableName: '',
  },
}
nodeTypes['node'] = {
  category: 'data',
  
  numInputs: 0,
  hasOutput: true,

  title: 'Node',

  props: {
    nodeName: '',
  },
}
nodeTypes['sql'] = {
  category: 'data',
  
  numInputs: 0,
  hasOutput: true,

  title: 'Sql',

  props: {
    sql: '',
  },
}




nodeTypes['union'] = {
  category: 'set-operations',

  numInputs: 2,
  hasOutput: true,

  title: 'Union',

  props: {
    allowDuplicates: false,
  },
}
nodeTypes['difference'] = {
  category: 'set-operations',

  numInputs: 2,
  hasOutput: true,

  title: 'Difference',

  props: {
  },
}
nodeTypes['intersection'] = {
  category: 'set-operations',

  numInputs: 2,
  hasOutput: true,

  title: 'Intersection',

  props: {
  },
}




nodeTypes['inner-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  title: 'Inner join',

  props: {
    condition: '',
  },
}
nodeTypes['left-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  title: 'Left join',

  props: {
    condition: '',
  },
}
nodeTypes['right-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  title: 'Right join',

  props: {
    condition: '',
  },
}
nodeTypes['full-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  title: 'Full join',

  props: {
    condition: '',
  },
}
nodeTypes['cross-join'] = {
  category: 'joins',

  numInputs: 2,
  hasOutput: true,

  title: 'Cross join',

  props: {
  },
}




nodeTypes['filter'] = {
  category: 'processing',
  
  numInputs: 1,
  hasOutput: true,

  title: 'Filter',

  props: {
    condition: '',
  },
}
nodeTypes['transform'] = {
  category: 'processing',
  
  numInputs: 1,
  hasOutput: true,

  title: 'Transform',

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

  title: 'Distinct',

  props: {
  },
}
nodeTypes['sort'] = {
  category: 'processing',
  
  numInputs: 1,
  hasOutput: true,

  title: 'Sort',

  props: {
    columns: '',
  },
}
nodeTypes['limit'] = {
  category: 'processing',

  numInputs: 1,
  hasOutput: true,

  title: 'Limit',

  props: {
    offset: '',

    limit: {
      value: '',
    },
  },
}



export default nodeTypes