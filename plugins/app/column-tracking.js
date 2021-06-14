export default { processNode }





function processNode(module, node, columnsMap) {
  if (columnsMap == null)
    columnsMap = {}



  let nodeColumns = columnsMap[`${module.id}, ${node.id}`]

  if (nodeColumns != null)
    return nodeColumns




  let inputsColumns = []

  for (let linkId of node.incomingLinks) {
    let link = module.data.links.map[linkId]

    let inputColumns

    if (link != null)
      inputColumns = processNode(module, module.data.nodes.map[link.from], columnsMap)
    else
      inputColumns = []
      
    inputsColumns.push(inputColumns)
  }


  

  if (node.type in nodeProcessing)
    nodeColumns = nodeProcessing[node.type](node, inputsColumns, columnsMap)
  else if (inputsColumns.length > 0)
    nodeColumns = inputsColumns[0]
  else
    nodeColumns = []

  columnsMap[`${module.id}, ${node.id}`] = nodeColumns

  return nodeColumns
}




let nodeProcessing = {}




nodeProcessing['table'] = (node, inputsColumns, columnsMap) => {
  let table = $state.project.tables.list.find(
    table => table.name === node.props.tableName)

  if (table == null)
    return []

  let columns = table.columns.split(',')

  columns.forEach(function (value, index, array) {
    array[index] = value.trim()
  })

  return columns
}
nodeProcessing['node'] = (node, inputsColumns, columnsMap) => {
  let parts = node.props.nodeName.split('.', 2)

  let refModule = $state.project.modules.list.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.data.nodes.map).find(node => node.props.name === parts[1])

  if (refNode == null)
    return []

  return processNode(refModule, refNode, columnsMap)
}
nodeProcessing['sql'] = (node, inputsColumns, columnsMap) => {
  let columns = node.props.sql.split(',')

  columns.forEach(function (value, index, array) {
    array[index] = value.trim()
  })

  return columns
}




function joinProcessing(node, inputsColumns, columnsMap) {
  return inputsColumns[0].concat(inputsColumns[1])
}

nodeProcessing['inner-join'] = joinProcessing
nodeProcessing['left-join'] = joinProcessing
nodeProcessing['right-join'] = joinProcessing
nodeProcessing['full-join'] = joinProcessing
nodeProcessing['cross-join'] = joinProcessing




nodeProcessing['transform'] = (node, inputsColumns, columnsMap) => {
  let columns = node.props.columns.split(',')

  columns.forEach(function (value, index, array) {
    array[index] = value.trim()
  })

  return columns
}