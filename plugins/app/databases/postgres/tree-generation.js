export default function generateTree(module, node) {
  return new TreeObj(module, node)
}




function TreeObj(module, node) {
  this.error = {
    message: null,
    node: null,
  }

  this.commons = []

  this.columnObjs = []

  this.rootNode = node
  this.rootObj = this.processNode(module, node)
}




TreeObj.prototype.processNode = function(module, node) {
  // Check enabled node type

  const database = $app.databases.data[$state.project.sql.database]

  if ((database.infos.disabledNodeTypes || []).includes(node.type)) {
    this.error.message = `Invalid query: ${$app.nodeTypes[node.type].title} node doesn\'t exist in current database.`
    this.error.node = node
    return
  }




  // Gather inputs

  const inputs = []

  for (const linkId of node.incomingLinks) {
    const link = module.data.links.map[linkId]
    
    if (link == null) {
      this.error.message = 'Query incomplete: node input missing.'
      this.error.node = node
      return
    }

    const input = module.data.nodes.map[link.from]
    const inputObj = this.processNode(module, input)

    if (this.error.message)
      return

    inputs.push({
      obj: inputObj,
      
      link: link,
    })
  }




  // Update column tables with aliases

  for (const input of inputs)
    if (input.link.props.alias)
      this.updateTable(input.obj.columnObjs, input.link.props.alias)



  
  // Root node: Capture input columns

  if (node === this.rootNode) {
    this.columnObjs = []

    for (const input of inputs)
      this.columnObjs = this.columnObjs.concat(input.obj.columnObjs)
  }




  // Node type processing
  
  const nodeObj = this.nodeTypeProcessing[node.type].call(this, node, inputs)




  // Process common
  
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




    nodeObj = this.createSelect({
      sourceType: 'common',

      columnObjs: nodeObj.columnObjs,
      
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
  const table = $state.project.tables.list.find(
    table => table.name === node.props.tableName)



  let columnObjs
  if (table == null)
    columnObjs = []
  else
    columnObjs = this.extractColumnObjs(table.columns, true, node.props.tableName)


    
  return this.createSelect({
    sourceType: 'table',

    columnObjs: columnObjs,

    tableName: node.props.tableName,
  })
}
TreeObj.prototype.nodeTypeProcessing['node'] = function (node, inputs) {
  return this.getRefNodeObj(node.props.nodeName, node)
}
TreeObj.prototype.nodeTypeProcessing['sql'] = function (node, inputs) {
  return {
    objectType: 'sql',

    columnObjs: this.extractColumnObjs(node.props.columns, false),

    sql: this.processField(node.props.sql, node),
  }
}




// Set operations

function setOperationProcessing(node, inputs) {
  // Node object

  const nodeObj = this.prepareSetOperation(inputs[0])




  // New source

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
  // Node object

  const nodeObj = this.prepareSelect(inputs[0], 'from', 'from')




  // New source

  let joinObj
  
  nodeObj.columnObjs = nodeObj.columnObjs.concat(inputs[1].obj.columnObjs)

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
  const nodeObj = this.prepareSelect(inputs[0], 'where', 'where')
  
  if (nodeObj.where == null)
    nodeObj.where = []

  nodeObj.where.push(this.processField(node.props.condition, node))

  return nodeObj 
}
TreeObj.prototype.nodeTypeProcessing['transform'] = function (node, inputs) {
  const nodeObj = this.prepareSelect(inputs[0], 'transform', 'where')

  if (node.props.group.active) {
    nodeObj.group = {
      columns: this.processField(node.props.group.columns, node),
      condition: this.processField(node.props.group.condition, node),
    }
  }

  nodeObj.columnObjs = this.extractColumnObjs(node.props.columns, false)

  nodeObj.select = this.processField(node.props.columns, node)

  return nodeObj
}
TreeObj.prototype.nodeTypeProcessing['distinct'] = function (node, inputs) {
  const nodeObj = this.prepareSelect(inputs[0], 'distinct', 'transform')

  if (node.props.columns) {
    nodeObj.distinct = {
      columns: this.processField(node.props.columns, node),
    }
  }

  return nodeObj
}
TreeObj.prototype.nodeTypeProcessing['sort'] = function (node, inputs) {
  const nodeObj = this.prepareSelect(inputs[0], 'sort', 'distinct')

  nodeObj.sort = this.processField(node.props.columns, node)

  return nodeObj
}
TreeObj.prototype.nodeTypeProcessing['limit'] = function (node, inputs) {
  let nodeObj = this.prepareSelect(inputs[0], 'limit', 'sort')

  if (node.props.offset.value) {
    nodeObj.offset = {
      value: this.processField(node.props.offset.value, node),
    }
  }

  if (node.props.limit.value) {
    nodeObj.limit = {
      value: this.processField(node.props.limit.value, node),
    }
  }
    
  return nodeObj
}





TreeObj.prototype.processField = function (input, node) {
  input = input.trim()

  const regex = /#<([^\r\n]+?\.[^\r\n]+?)>#/g

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

    output.push(this.getRefNodeObj(match[1], node))
  }

  return output
}
TreeObj.prototype.getRefNodeObj = function (fullName, node) {
  const parts = fullName.split('.', 2)

  const refModule = $state.project.modules.list.find(module => module.name === parts[0])

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





TreeObj.prototype.prepareSetOperation = function (input) {
  let nodeObj

  if (input.obj.objectType === 'set-operations') {
    nodeObj = input.obj
  } else {
    nodeObj = {
      objectType: 'set-operations',

      columnObjs: this.updateTable(input.obj.columnObjs),

      sources: [
        { obj: input.obj },
      ],
    }
  }

  return nodeObj
}





TreeObj.prototype.prepareSelect = function (input, newClause, maxClause) {
  let nodeObj

  if (input.obj.objectType === 'select'
  && input.obj.clauseLevel <= sqlClauseLevels[maxClause]
  && (!input.link.props.alias ||
  (input.link.props.alias && input.obj.from.length === 1))) {
    nodeObj = input.obj

    if (input.link.props.alias)
      nodeObj.from[0].alias = input.link.props.alias
  } else {
    nodeObj = this.createSelect({
      sourceType: 'object',

      columnObjs: this.updateTable(input.obj.columnObjs, input.link.props.alias),

      alias: input.link.props.alias,

      obj: input.obj,
    })
  }

  nodeObj.clauseLevel = sqlClauseLevels[newClause]

  return nodeObj
}
TreeObj.prototype.createSelect = function (source) {
  return {
    objectType: 'select',

    columnObjs: source.columnObjs,

    clauseLevel: sqlClauseLevels['from'],

    from: [
      source,
    ],

    select: ['*'],
  }
}




import parseColumns from '../../column-extraction/parser.js'

TreeObj.prototype.extractColumnObjs = function (text, first, table) {
  const columnObjs = []
  
  for (const column of parseColumns(text, first))
    columnObjs.push({ table: table, column: column })

  return columnObjs
}
TreeObj.prototype.updateTable = function (columnObjs, table) {
  for (const columnObj of columnObjs)
    columnObj.table = table

  return columnObjs
}