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
  let deps = []

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

    deps.push({ obj: depObj, link: link })
  }




  // Node type processing

  let nodeObj = nodeTypeProcessing[node.type](node, deps, treeObj)


  

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

nodeTypeProcessing['table'] = (node, deps, treeObj) => {
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
nodeTypeProcessing['node'] = (node, deps, treeObj) => {
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
nodeTypeProcessing['sql'] = (node, deps, treeObj) => {
  if (node.props.sql.trim() === '') {
    treeObj.error = 'Query incomplete: SQL is empty.'
    treeObj.node = node
    return
  }


  return {
    objectType: 'sql',

    sql: node.props.sql,
  }
}




// Set operations

function setOperationProcessing(node, deps, treeObj) {
  // First object

  let nodeObj

  if (deps[0].obj.objectType === 'set-operations') {
    nodeObj = _app.notSoShallowCopy(deps[0].obj)
  } else {
    nodeObj = {
      objectType: 'set-operations',

      sources: [
        { obj: deps[0].obj },
      ],
    }
  }



  // Second object

  if (deps[1].obj.objectType === 'set-operations'
  && deps[1].obj.sources.length === 1)
    nodeObj.sources.push({ ...deps[1].obj.sources[0] })
  else
    nodeObj.sources.push({ obj: deps[1].obj })

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

function joinProcessing(node, deps, treeObj) {
  // First object

  let nodeObj = initNodeObj(deps[0], 'from', 'from')



  // Second object

  if (deps[1].obj.objectType === 'select'
  && deps[1].obj.clauseLevel <= sqlClauseLevels['from']
  && deps[1].obj.from.length === 1)
    nodeObj.from.push({ ...deps[1].obj.from[0] })
  else
    nodeObj.from.push({ sourceType: 'object', obj: deps[1].obj })

  Object.assign(nodeObj.from[nodeObj.from.length - 1], {
    alias: deps[1].link.props.alias,

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




nodeTypeProcessing['filter'] = (node, deps, treeObj) => {
  let nodeObj = initNodeObj(deps[0], 'where', 'where')
  
  if (nodeObj.where == null)
    nodeObj.where = []

  nodeObj.where.push(node.props.condition)

  return nodeObj 
}
nodeTypeProcessing['transform'] = (node, deps, treeObj) => {
  let nodeObj = initNodeObj(deps[0], 'where', 'transform')

  nodeObj.group = node.props.group.active ? {
    columns: node.props.group.columns,

    condition: node.props.group.condition,
  } : null

  nodeObj.select = node.props.columns

  return nodeObj
}
nodeTypeProcessing['distinct'] = (node, deps, treeObj) => {
  let nodeObj = initNodeObj(deps[0], 'transform', 'distinct')

  nodeObj.distinct = node.props.columns

  return nodeObj
}
nodeTypeProcessing['sort'] = (node, deps, treeObj) => {
  let nodeObj = initNodeObj(deps[0], 'distinct', 'sort')

  nodeObj.sort = node.props.columns

  return nodeObj
}
nodeTypeProcessing['reduce'] = (node, deps, treeObj) => {
  let nodeObj = initNodeObj(deps[0], 'sort', 'reduce')

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




function initNodeObj(dep, maxClause, newClause) {
  let nodeObj

  if (dep.obj.objectType === 'select'
  && dep.obj.clauseLevel <= sqlClauseLevels[maxClause]
  && (dep.link.props.alias === '' ||
  (dep.link.props.alias !== '' && dep.obj.from.length === 1))) {
    nodeObj = _app.notSoShallowCopy(dep.obj)

    if (dep.link.props.alias !== '')
      nodeObj.from[0].alias = dep.link.props.alias
  } else {
    nodeObj = {
      objectType: 'select',
  
      clauseLevel: sqlClauseLevels['from'],
  
      from: [
        {
          sourceType: 'object',

          alias: dep.link.props.alias,
  
          obj: dep.obj,
        },
      ],
    }
  }

  nodeObj.clauseLevel = sqlClauseLevels[newClause]

  return nodeObj
}