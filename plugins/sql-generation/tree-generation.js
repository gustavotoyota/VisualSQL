export default {
  processNodes(store, module, root, options) {
    let mainObj = {}

    mainObj.options = options

    mainObj.store = store

    mainObj.error = false
    mainObj.node = null
    mainObj.message = ''

    mainObj.commons = []

    mainObj.rootObj = processNode(module, root, mainObj)

    console.log(mainObj)

    return mainObj
  }
}


function processNode(module, node, mainObj) {
  let depObjs = []

  for (let linkId of node.incomingLinks) {
    let link = module.links[linkId]
    if (link == null) {
      mainObj.error = true
      mainObj.node = node
      mainObj.message = 'Query incomplete: node input missing.'
      return
    }

    let dep = module.nodes[link.from]
    let depObj = processNode(module, dep, mainObj)

    if (mainObj.error)
      return

    depObjs.push(depObj)
  }




  // Node type processing

  let nodeObj = nodeTypeProcessing[node.type](node, depObjs, mainObj)


  

  if (node.props.name === '')
    return nodeObj



    
  // Create common

  let commonName = module.name + '.' + node.props.name
  let commonIdx = mainObj.commons.findIndex(common => common.name === commonName)

  if (commonIdx < 0) {
    commonIdx = mainObj.commons.length

    mainObj.commons.push({
      name: commonName,

      module: module,
      node: node,

      obj: nodeObj,
    })
  }

  return {
    objectType: 'common',

    commonIdx: commonIdx,
    commonName: commonName,

    moduleName: module.name,
    nodeName: node.props.name,
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

nodeTypeProcessing['table'] = (node, depObjs, mainObj) => {
  if (node.props.tableName === '') {
    mainObj.error = true
    mainObj.node = node
    mainObj.message = 'Query incomplete: referenced table not found.'
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
nodeTypeProcessing['node'] = (node, depObjs, mainObj) => {
  // Get reference node object

  let parts = node.props.nodeName.split('.', 2)

  let refModule = mainObj.store.state.project.modules.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.nodes).find(node => node.props.name === parts[1])

  let refNodeObj = processNode(refModule, refNode, mainObj)

  return refNodeObj
}
nodeTypeProcessing['sql'] = (node, depObjs, mainObj) => {
  if (node.props.sql.trim() === '') {
    mainObj.error = true
    mainObj.node = node
    mainObj.message = 'Query incomplete: SQL is empty.'
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

function setOperationProcessing(node, depObjs, mainObj) {
  return {
    objectType: 'set-operation',

    operationType: node.type,

    objA: depObjs[0],
    objB: depObjs[1],

    allowDuplicates: node.props.allowDuplicates,
  }
}

nodeTypeProcessing['union'] = setOperationProcessing
nodeTypeProcessing['difference'] = setOperationProcessing
nodeTypeProcessing['intersection'] = setOperationProcessing




// Joins

function joinProcessing(node, depObjs, mainObj) {
  // First object

  let nodeObj = initNodeObj(depObjs[0], 'from')



  // Second object

  if (depObjs[1].objectType === 'select'
  && depObjs[1].clauseLevel <= sqlClauseLevels['from']
  && depObjs[1].from.length === 1) {
    nodeObj.from.push({
      ...depObjs[1].from[0],

      joinType: node.type,
      joinCondition: node.props.condition,
    })
  } else {
    nodeObj.from.push({
      sourceType: 'object',

      obj: depObjs[1],

      joinType: node.type,
      joinCondition: node.props.condition,
    })
  }



  return nodeObj
}

nodeTypeProcessing['inner-join'] = joinProcessing
nodeTypeProcessing['left-join'] = joinProcessing
nodeTypeProcessing['right-join'] = joinProcessing
nodeTypeProcessing['full-join'] = joinProcessing
nodeTypeProcessing['cross-join'] = joinProcessing




nodeTypeProcessing['filter'] = (node, depObjs, mainObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'where')

  nodeObj.clauseLevel = sqlClauseLevels['where']
  
  if (nodeObj.where == null)
    nodeObj.where = []

  nodeObj.where.push(node.props.condition)

  return nodeObj 
}
nodeTypeProcessing['transform'] = (node, depObjs, mainObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'where')

  nodeObj.clauseLevel = sqlClauseLevels['transform']

  nodeObj.group = node.props.group.active ? {
    columns: node.props.group.columns,

    condition: node.props.group.condition,
  } : null

  nodeObj.select = node.props.outputColumns

  return nodeObj
}
nodeTypeProcessing['distinct'] = (node, depObjs, mainObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'transform')

  nodeObj.clauseLevel = sqlClauseLevels['distinct']

  nodeObj.distinct = node.props.columns

  return nodeObj
}
nodeTypeProcessing['sort'] = (node, depObjs, mainObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'distinct')

  nodeObj.clauseLevel = sqlClauseLevels['sort']

  nodeObj.sort = node.props.columns

  return nodeObj
}
nodeTypeProcessing['reduce'] = (node, depObjs, mainObj) => {
  let nodeObj = initNodeObj(depObjs[0], 'sort')

  nodeObj.clauseLevel = sqlClauseLevels['reduce']

  nodeObj.reduce = node.props.offset.active && node.props.limit.active ? {
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
  && obj.clauseLevel <= sqlClauseLevels[maxClause])
    nodeObj = _app.notSoShallowCopy(obj)
  else
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

  return nodeObj
}