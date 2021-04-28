export default function generateTree(store, module, root, options) {
  let treeObj = {}

  treeObj.options = options

  treeObj.store = store

  treeObj.error = null
  treeObj.node = null

  treeObj.commons = []

  treeObj.rootObj = processNode(module, root, treeObj)

  return treeObj
}


function processNode(module, node, treeObj) {
  let depObjs = []

  for (let linkId of node.incomingLinks) {
    let link = module.links[linkId]
    if (link == null) {
      treeObj.error = 'Query incomplete: node input missing.'
      treeObj.node = node
      return
    }

    let dep = module.nodes[link.from]
    let depObj = processNode(module, dep, treeObj)

    if (treeObj.error)
      return

    depObjs.push(depObj)
  }




  // Node type processing

  let nodeObj = nodeTypeProcessing[node.type](node, depObjs, treeObj)


  

  if (node.props.name === '')
    return nodeObj


    

  // Find common

  let commonFullName = module.name + '.' + node.props.name
  let commonIdx = treeObj.commons.findIndex(
    common => common.fullName === commonFullName)




  // Common not found: Create common

  if (commonIdx < 0) {
    commonIdx = treeObj.commons.length

    treeObj.commons.push({
      name: node.props.name,
      fullName: commonFullName,

      module: module,
      node: node,

      obj: nodeObj,
    })
  }




  // Resolve conflicts

  let conflicts = treeObj.commons.filter(
    common => common.node.props.name === node.props.name)

  if (conflicts.length > 1)
    for (let conflict of conflicts)
      conflict.name = conflict.fullName.replace('.', '_')




  return {
    objectType: 'common',

    commonIdx: commonIdx,
  }
}




const sqlClauseLevels = {
  from: 0,
  where: 1,
  transform: 2,
  distinct: 3,
  sort: 4,
  reduce: 5,
}




let nodeTypeProcessing = {}




// Data sources

nodeTypeProcessing['table'] = (node, depObjs, treeObj) => {
  if (node.props.tableName === '') {
    treeObj.error = 'Query incomplete: referenced table not found.'
    treeObj.node = node
    return
  }

  return {
    objectType: 'select',

    clauseLevel: sqlClauseLevels['from'],

    from: [
      {
        sourceType: 'table',

        tableName: node.props.tableName,
      },
    ],
  }
}
nodeTypeProcessing['node'] = (node, depObjs, treeObj) => {
  // Get reference node object

  let parts = node.props.nodeName.split('.', 2)

  let refModule = treeObj.store.state.project.modules.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.nodes).find(node => node.props.name === parts[1])

  if (refNode == null) {
    treeObj.error = 'Query incomplete: referenced node not found.'
    treeObj.node = node
    return
  }

  let refNodeObj = processNode(refModule, refNode, treeObj)

  return {
    objectType: 'select',

    clauseLevel: sqlClauseLevels['from'],

    from: [
      {
        sourceType: 'common',
        
        commonIdx: refNodeObj.commonIdx,
      },
    ],
  }
}
nodeTypeProcessing['sql'] = (node, depObjs, treeObj) => {
  if (node.props.sql.trim() === '') {
    treeObj.error = 'Query incomplete: SQL is empty.'
    treeObj.node = node
    return
  }


  return {
    objectType: 'select',

    clauseLevel: sqlClauseLevels['from'],

    from: [
      {
        sourceType: 'sql',

        sql: node.props.sql,
      },
    ],
  }
}




// Set operations

function setOperationProcessing(node, depObjs, treeObj) {
  // First object

  let nodeObj

  if (depObjs[0].objectType === 'set-operations') {
    nodeObj = _app.notSoShallowCopy(depObjs[0])
  } else {
    nodeObj = {
      objectType: 'set-operations',

      sources: [
        { obj: depObjs[0] },
      ],
    }
  }



  // Second object

  if (depObjs[1].objectType === 'set-operations'
  && depObjs[1].sources.length === 1)
    nodeObj.sources.push({ ...depObjs[1].sources[0] })
  else
    nodeObj.sources.push({ obj: depObjs[1] })

  Object.assign(nodeObj.sources[nodeObj.sources.length - 1], {
    operationType: node.type,

    allowDuplicates: node.props.allowDuplicates,
  })
  



  return nodeObj
}

nodeTypeProcessing['union'] = setOperationProcessing
nodeTypeProcessing['difference'] = setOperationProcessing
nodeTypeProcessing['intersection'] = setOperationProcessing




// Joins

function joinProcessing(node, depObjs, treeObj) {
  // First object

  let nodeObj = initNodeObj(depObjs[0], 'from')



  // Second object

  if (depObjs[1].objectType === 'select'
  && depObjs[1].clauseLevel <= sqlClauseLevels['from']
  && depObjs[1].from.length === 1)
    nodeObj.from.push({ ...depObjs[1].from[0] })
  else
    nodeObj.from.push({ sourceType: 'object', obj: depObjs[1] })

  Object.assign(nodeObj.from[nodeObj.from.length - 1], {
    joinType: node.type,
    joinCondition: node.props.condition,
  })



  return nodeObj
}

nodeTypeProcessing['inner-join'] = joinProcessing
nodeTypeProcessing['left-join'] = joinProcessing
nodeTypeProcessing['right-join'] = joinProcessing
nodeTypeProcessing['full-join'] = joinProcessing
nodeTypeProcessing['cross-join'] = joinProcessing




nodeTypeProcessing['filter'] = (node, depObjs, treeObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'where')

  nodeObj.clauseLevel = sqlClauseLevels['where']
  
  if (nodeObj.where == null)
    nodeObj.where = []

  nodeObj.where.push(node.props.condition)

  return nodeObj 
}
nodeTypeProcessing['transform'] = (node, depObjs, treeObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'where')

  nodeObj.clauseLevel = sqlClauseLevels['transform']

  nodeObj.group = node.props.group.active ? {
    columns: node.props.group.columns,

    condition: node.props.group.condition,
  } : null

  nodeObj.select = node.props.columns

  return nodeObj
}
nodeTypeProcessing['distinct'] = (node, depObjs, treeObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'transform')

  nodeObj.clauseLevel = sqlClauseLevels['distinct']

  nodeObj.distinct = node.props.columns

  return nodeObj
}
nodeTypeProcessing['sort'] = (node, depObjs, treeObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'distinct')

  nodeObj.clauseLevel = sqlClauseLevels['sort']

  nodeObj.sort = node.props.columns

  return nodeObj
}
nodeTypeProcessing['reduce'] = (node, depObjs, treeObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'sort')

  nodeObj.clauseLevel = sqlClauseLevels['reduce']

  nodeObj.reduce = node.props.offset.active || node.props.limit.active ? {
    offset: node.props.offset.active ? node.props.offset.value : null,

    limit: node.props.limit.active ? {
      value: node.props.limit.value,
      percent: node.props.limit.percent,
      withTies: node.props.limit.withTies,
    } : null,
  } : null

  return nodeObj
}




function initNodeObj(obj, maxClause) {
  let nodeObj

  if (obj.objectType === 'select'
  && obj.clauseLevel <= sqlClauseLevels[maxClause]) {
    nodeObj = _app.notSoShallowCopy(obj)
  } else {
    nodeObj = {
      objectType: 'select',
  
      clauseLevel: sqlClauseLevels['from'],
  
      from: [
        {
          sourceType: 'object',
  
          obj: obj,
        },
      ],
    }
  }

  return nodeObj
}