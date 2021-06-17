export default function generateTree(module, node) {
  let treeObj = {}

  treeObj.error = {
    message: null,
    node: null,
  }

  treeObj.commons = []

  treeObj.rootObj = processNode(module, node, treeObj)

  return treeObj
}


function processNode(module, node, treeObj) {
  // Check node type

  const database = $app.databases.data[$state.project.sql.database]

  if ((database.infos.disabledNodeTypes || []).includes(node.type)) {
    treeObj.error.message = `Invalid query: ${$app.nodeTypes[node.type].title} node doesn\'t exist in current database.`
    treeObj.error.node = node
    return
  }




  // Process inputs

  let inputs = []

  for (let linkId of node.incomingLinks) {
    let link = module.data.links.map[linkId]
    if (link == null) {
      treeObj.error.message = 'Query incomplete: node input missing.'
      treeObj.error.node = node
      return
    }

    let input = module.data.nodes.map[link.from]
    let inputObj = processNode(module, input, treeObj)

    if (treeObj.error.message)
      return

    inputs.push({
      obj: inputObj,
      
      link: link,
    })
  }




  // Node type processing

  let nodeObj = nodeTypeProcessing[node.type](node, inputs, treeObj)


  

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




  return createSelect({
    sourceType: 'common',
    
    commonIdx: commonIdx,
  })
}




const sqlClauseLevels = {
  from: 0,
  where: 1,
  transform: 2,
  distinct: 3,
  sort: 4,
  limit: 5,
}




let nodeTypeProcessing = {}




// Data sources

nodeTypeProcessing['table'] = (node, inputs, treeObj) => {
  return createSelect({
    sourceType: 'table',

    tableName: processField(node.props.tableName),
  })
}
nodeTypeProcessing['node'] = (node, inputs, treeObj) => {
  // Get reference node object

  let parts = node.props.nodeName.split('.', 2)

  let refModule = $state.project.modules.list.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.data.nodes.map).find(node => node.props.name === parts[1])

  if (refNode == null) {
    treeObj.error.message = 'Query incomplete: referenced node not found.'
    treeObj.error.node = node
    return
  }

  let refNodeObj = processNode(refModule, refNode, treeObj)

  return refNodeObj
}
nodeTypeProcessing['sql'] = (node, inputs, treeObj) => {
  return {
    objectType: 'sql',

    sql: processField(node.props.sql),
  }
}




// Set operations

function setOperationProcessing(node, inputs, treeObj) {
  // First object

  let nodeObj

  if (inputs[0].obj.objectType === 'set-operations') {
    nodeObj = $utils.notSoShallowCopy(inputs[0].obj)
  } else {
    nodeObj = {
      objectType: 'set-operations',

      sources: [
        { obj: inputs[0].obj },
      ],
    }
  }




  // Second object

  let operationObj = {
    obj: inputs[1].obj,

    operationType: node.type,

    allowDuplicates: node.props.allowDuplicates,
  }

  if (operationObj.obj.objectType === 'set-operations')
    operationObj.obj = createSelect({
      sourceType: 'object',

      alias: inputs[1].link.props.alias,

      obj: inputs[1].obj,
    })

  nodeObj.sources.push(operationObj)
  



  return nodeObj
}

nodeTypeProcessing['union'] = setOperationProcessing
nodeTypeProcessing['difference'] = setOperationProcessing
nodeTypeProcessing['intersection'] = setOperationProcessing




// Joins

function joinProcessing(node, inputs, treeObj) {
  // First object

  let nodeObj = initNodeObj(inputs[0], 'from', 'from')



  // Second object

  let joinObj

  if (inputs[1].obj.objectType === 'select'
  && inputs[1].obj.clauseLevel <= sqlClauseLevels['from']
  && inputs[1].obj.from.length === 1)
    joinObj = { ...inputs[1].obj.from[0] }
  else
    joinObj = { sourceType: 'object', obj: inputs[1].obj }

  joinObj.alias = inputs[1].link.props.alias
  
  joinObj.joinType = node.type
  if (node.type !== 'cross-join')
    joinObj.joinCondition = processField(node.props.condition)

  nodeObj.from.push(joinObj)



  return nodeObj
}

nodeTypeProcessing['inner-join'] = joinProcessing
nodeTypeProcessing['left-join'] = joinProcessing
nodeTypeProcessing['right-join'] = joinProcessing
nodeTypeProcessing['full-join'] = joinProcessing
nodeTypeProcessing['cross-join'] = joinProcessing




nodeTypeProcessing['filter'] = (node, inputs, treeObj) => {
  let nodeObj = initNodeObj(inputs[0], 'where', 'where')
  
  if (nodeObj.where == null)
    nodeObj.where = []

  nodeObj.where.push(processField(node.props.condition))

  return nodeObj 
}
nodeTypeProcessing['transform'] = (node, inputs, treeObj) => {
  let nodeObj = initNodeObj(inputs[0], 'where', 'transform')

  nodeObj.group = node.props.group.active ? {
    columns: processField(node.props.group.columns),

    condition: node.props.group.condition.trim(),
  } : null

  nodeObj.select = node.props.columns.trim()
  if (nodeObj.select === '')
    nodeObj.select = '*'

  return nodeObj
}
nodeTypeProcessing['distinct'] = (node, inputs, treeObj) => {
  let nodeObj = initNodeObj(inputs[0], 'transform', 'distinct')

  nodeObj.distinct = true

  return nodeObj
}
nodeTypeProcessing['sort'] = (node, inputs, treeObj) => {
  let nodeObj = initNodeObj(inputs[0], 'distinct', 'sort')

  nodeObj.sort = processField(node.props.columns)

  return nodeObj
}
nodeTypeProcessing['limit'] = (node, inputs, treeObj) => {
  let nodeObj = initNodeObj(inputs[0], 'sort', 'limit')

  nodeObj.limit = {
    value: node.props.limit.value,
  }

  nodeObj.offset = node.props.offset

  return nodeObj
}




function initNodeObj(input, maxClause, newClause) {
  let nodeObj

  if (input.obj.objectType === 'select'
  && input.obj.clauseLevel <= sqlClauseLevels[maxClause]
  && (input.link.props.alias === '' ||
  (input.link.props.alias !== '' && input.obj.from.length === 1))) {
    nodeObj = $utils.notSoShallowCopy(input.obj)

    if (input.link.props.alias !== '')
      nodeObj.from[0].alias = input.link.props.alias
  } else {
    nodeObj = createSelect({
      sourceType: 'object',

      alias: input.link.props.alias,

      obj: input.obj,
    })
  }

  nodeObj.clauseLevel = sqlClauseLevels[newClause]

  return nodeObj
}




function createSelect(source) {
  return {
    objectType: 'select',

    clauseLevel: sqlClauseLevels['from'],

    from: [
      source,
    ],

    select: '*',
  }
}




function processField(field) {
  const trimmed = field.trim()
  
  if (trimmed === '')
    return '<missing>'

  return trimmed
}