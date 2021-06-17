export default { getInputColumns }





function getInputColumns(module, node) {
  const inputsColumns = getInputsColumns(module, node, {})



  let resultColumns = []

  for (const inputColumns of inputsColumns)
    resultColumns = $utils.arrayUnion(resultColumns, inputColumns)

  return resultColumns
}





function getInputsColumns(module, node, columnsMap) {
  let inputsColumns = []

  for (let linkId of node.incomingLinks) {
    let link = module.data.links.map[linkId]

    let inputColumns

    if (link != null)
      inputColumns = getOutputColumns(module, module.data.nodes.map[link.from], columnsMap)
    else
      inputColumns = []
      
    inputsColumns.push(inputColumns)
  }

  return inputsColumns
}





function getOutputColumns(module, node, columnsMap) {
  let nodeColumns = columnsMap[`${module.id}, ${node.id}`]

  if (nodeColumns != null)
    return nodeColumns




  // Get inputs columns

  let inputsColumns = getInputsColumns(module, node, columnsMap)



  
  // Process output columns

  if (node.type in nodeProcessing)
    nodeColumns = nodeProcessing[node.type](node, inputsColumns, columnsMap)
  else
    nodeColumns = inputsColumns[0] ?? []

  columnsMap[`${module.id}, ${node.id}`] = nodeColumns

  return nodeColumns
}




let nodeProcessing = {}



import parseColumns from './parser'

nodeProcessing['table'] = (node, inputsColumns, columnsMap) => {
  let table = $state.project.tables.list.find(
    table => table.name === node.props.tableName)

  if (table == null)
    return []

  return parseColumns(table.columns, true)
}
nodeProcessing['node'] = (node, inputsColumns, columnsMap) => {
  let parts = (node.props.nodeName ?? '').split('.', 2)

  let refModule = $state.project.modules.list.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.data.nodes.map).find(node => node.props.name === parts[1])

  if (refNode == null)
    return []

  return getOutputColumns(refModule, refNode, columnsMap)
}
nodeProcessing['sql'] = (node, inputsColumns, columnsMap) => {
  return parseColumns(node.props.sql, false)
}




function joinProcessing(node, inputsColumns, columnsMap) {
  return $utils.arrayUnion(inputsColumns[0], inputsColumns[1])
}

nodeProcessing['inner-join'] = joinProcessing
nodeProcessing['left-join'] = joinProcessing
nodeProcessing['right-join'] = joinProcessing
nodeProcessing['full-join'] = joinProcessing
nodeProcessing['cross-join'] = joinProcessing




nodeProcessing['transform'] = (node, inputsColumns, columnsMap) => {
  return parseColumns(node.props.columns, false)
}