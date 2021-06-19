export default function generateTree(module, node) {
  return new TreeObj(module, node)
}




function TreeObj(module, node) {
  this.error = {
    message: null,
    node: null,
  }

  this.commons = []

  this.rootObj = this.processNode(module, node)
}




TreeObj.prototype.processNode = function(module, node) {
  // Check node type

  const database = $app.databases.data[$state.project.sql.database]

  if ((database.infos.disabledNodeTypes || []).includes(node.type)) {
    this.error.message = `Invalid query: ${$app.nodeTypes[node.type].title} node doesn\'t exist in current database.`
    this.error.node = node
    return
  }




  // Process inputs

  let inputs = []

  for (let linkId of node.incomingLinks) {
    let link = module.data.links.map[linkId]
    if (link == null) {
      this.error.message = 'Query incomplete: node input missing.'
      this.error.node = node
      return
    }

    let input = module.data.nodes.map[link.from]
    let inputObj = this.processNode(module, input)

    if (this.error.message)
      return

    inputs.push({
      obj: inputObj,
      
      link: link,
    })
  }




  // Node type processing

  let nodeObj = this.nodeTypeProcessing[node.type].call(this, node, inputs)




  // Proess common
  
  if (node.props.common && node.props.name !== '') {
    // Find common

    let commonFullName = module.name + '.' + node.props.name
    let commonIdx = this.commons.findIndex(
      common => common.fullName === commonFullName)




    // Common not found: Create common

    if (commonIdx < 0) {
      commonIdx = this.commons.length

      this.commons.push({
        name: node.props.name,
        fullName: commonFullName,

        module: module,
        node: node,

        obj: nodeObj,
      })
    }




    // Resolve conflicts

    let conflicts = this.commons.filter(
      common => common.node.props.name === node.props.name)

    if (conflicts.length > 1)
      for (let conflict of conflicts)
        conflict.name = conflict.fullName.replace('.', '_')




    nodeObj = createSelect({
      sourceType: 'common',
      
      commonIdx: commonIdx,
    })
  }



  return nodeObj
}




const sqlClauseLevels = {
  from: 0,
  where: 1,
  transform: 2,
  distinct: 3,
  sort: 4,
  limit: 5,
}




TreeObj.prototype.nodeTypeProcessing = {}




// Data sources

TreeObj.prototype.nodeTypeProcessing['table'] = function (node, inputs) {
  return createSelect({
    sourceType: 'table',

    tableName: node.props.tableName,
  })
}
TreeObj.prototype.nodeTypeProcessing['node'] = function (node, inputs) {
  return this.getRefNodeObj(node.props.nodeName, node)
}
TreeObj.prototype.nodeTypeProcessing['sql'] = function (node, inputs) {
  return {
    objectType: 'sql',

    sql: this.processField(node.props.sql, node),
  }
}




// Set operations

function setOperationProcessing(node, inputs) {
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

  nodeObj.sources.push({
    obj: inputs[1].obj,

    operationType: node.type,

    allowDuplicates: node.props.allowDuplicates,
  })
  



  return nodeObj
}

TreeObj.prototype.nodeTypeProcessing['union'] = setOperationProcessing
TreeObj.prototype.nodeTypeProcessing['difference'] = setOperationProcessing
TreeObj.prototype.nodeTypeProcessing['intersection'] = setOperationProcessing




// Joins

function joinProcessing(node, inputs) {
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
    joinObj.joinCondition = this.processField(node.props.condition, node)

  nodeObj.from.push(joinObj)



  return nodeObj
}

TreeObj.prototype.nodeTypeProcessing['inner-join'] = joinProcessing
TreeObj.prototype.nodeTypeProcessing['left-join'] = joinProcessing
TreeObj.prototype.nodeTypeProcessing['right-join'] = joinProcessing
TreeObj.prototype.nodeTypeProcessing['full-join'] = joinProcessing
TreeObj.prototype.nodeTypeProcessing['cross-join'] = joinProcessing




TreeObj.prototype.nodeTypeProcessing['filter'] = function (node, inputs) {
  let nodeObj = initNodeObj(inputs[0], 'where', 'where')
  
  if (nodeObj.where == null)
    nodeObj.where = []

  nodeObj.where.push(this.processField(node.props.condition, node))

  return nodeObj 
}
TreeObj.prototype.nodeTypeProcessing['transform'] = function (node, inputs) {
  let nodeObj = initNodeObj(inputs[0], 'where', 'transform')

  nodeObj.group = node.props.group.active ? {
    columns: this.processField(node.props.group.columns, node),

    condition: this.processField(node.props.group.condition, node),
  } : null

  nodeObj.select = this.processField(node.props.columns, node)

  return nodeObj
}
TreeObj.prototype.nodeTypeProcessing['distinct'] = function (node, inputs) {
  let nodeObj = initNodeObj(inputs[0], 'transform', 'distinct')

  nodeObj.distinct = {
    columns: node.props.columns
  }

  return nodeObj
}
TreeObj.prototype.nodeTypeProcessing['sort'] = function (node, inputs) {
  let nodeObj = initNodeObj(inputs[0], 'distinct', 'sort')

  nodeObj.sort = this.processField(node.props.columns, node)

  return nodeObj
}
TreeObj.prototype.nodeTypeProcessing['limit'] = function (node, inputs) {
  let nodeObj = initNodeObj(inputs[0], 'sort', 'limit')

  nodeObj.offset = node.props.offset ?
    this.processField(node.props.offset, node) : null
  nodeObj.limit = node.props.limit ?
    this.processField(node.props.limit, node) : null

  return nodeObj
}






TreeObj.prototype.processField = function (input, node) {
  input = input.trim()

  const regex = /#(\w+?\.\w+?)#/g

  let output = []
  let lastIndex = 0

  while (true) {
    const match = regex.exec(input)

    if (match == null) {
      output.push(input.substring(lastIndex))
      break
    }

    output.push(input.substring(lastIndex, match.index))
    lastIndex = match.index + match[0].length

    output.push(this.getRefNodeObj(match[1].replace('##', '#'), node))
  }

  return output
}




TreeObj.prototype.getRefNodeObj = function (fullName, node) {
  let parts = fullName.split('.', 2)

  let refModule = $state.project.modules.list.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.data.nodes.map).find(node => node.props.name === parts[1])

  if (refNode == null) {
    this.error.message = 'Query incomplete: referenced node not found.'
    this.error.node = node
    return
  }

  return this.processNode(refModule, refNode)
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

    select: ['*'],
  }
}