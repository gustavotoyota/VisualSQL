export default {
  init(store) {
    let columnsObj = {}

    columnsObj.store = store

    columnsObj.nodeColumns = {}

    columnsObj.processNode = (module, node) =>
      processNode(module, node, columnsObj)

    return columnsObj
  }
}




function processNode(module, node, columnsObj) {
  let nodeColumns = columnsObj.nodeColumns[`${module.id}, ${node.id}`]

  if (nodeColumns)
    return nodeColumns




  let inputsColumns = []

  for (let linkId of node.incomingLinks) {
    let link = module.data.links.map[linkId]

    let inputColumns

    if (link)
      inputColumns = processNode(module, module.data.nodes.map[link.from], columnsObj)
    else
      inputColumns = []
      
    inputsColumns.push(inputColumns)
  }


  

  if (node.type in nodeProcessing)
    nodeColumns = nodeProcessing[node.type](node, inputsColumns, columnsObj)
  else if (inputsColumns.length > 0)
    nodeColumns = inputsColumns[0]
  else
    nodeColumns = []

  columnsObj.nodeColumns[`${module.id}, ${node.id}`] = nodeColumns

  return nodeColumns
}




let nodeProcessing = {}




nodeProcessing['table'] = (node, inputsColumns, columnsObj) => {
  let table = columnsObj.store.state.project.tables.find(
    table => table.name === node.props.tableName)

  if (!table)
    return []

  let columns = table.columns.split(',')

  columns.forEach(function (value, index, array) {
    array[index] = value.trim()
  })

  return columns
}
nodeProcessing['node'] = (node, inputsColumns, columnsObj) => {
  let parts = node.props.nodeName.split('.', 2)

  let refModule = columnsObj.store.state.project.modules.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.data.nodes.map).find(node => node.props.name === parts[1])

  if (refNode == null)
    return []

  return processNode(refModule, refNode, columnsObj)
}
nodeProcessing['sql'] = (node, inputsColumns, columnsObj) => {
  let columns = node.props.sql.split(',')

  columns.forEach(function (value, index, array) {
    array[index] = value.trim()
  })

  return columns
}




function joinProcessing(node, inputsColumns, columnsObj) {
  return inputsColumns[0].concat(inputsColumns[1])
}

nodeProcessing['inner-join'] = joinProcessing
nodeProcessing['left-join'] = joinProcessing
nodeProcessing['right-join'] = joinProcessing
nodeProcessing['full-join'] = joinProcessing
nodeProcessing['cross-join'] = joinProcessing




nodeProcessing['transform'] = (node, inputsColumns, columnsObj) => {
  let columns = node.props.columns.split(',')

  columns.forEach(function (value, index, array) {
    array[index] = value.trim()
  })

  return columns
}