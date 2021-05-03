export default {
  initTracking(store) {
    let trackingObj = {}

    trackingObj.store = store

    trackingObj.nodeColumns = {}

    trackingObj.processNode = (module, node) =>
      processNode(module, node, trackingObj)

    return trackingObj
  }
}




function processNode(module, node, trackingObj) {
  let nodeColumns = trackingObj.nodeColumns[`${module.id}, ${node.id}`]

  if (nodeColumns)
    return nodeColumns




  let inputsColumns = []

  for (let linkId of node.incomingLinks) {
    let link = module.links[linkId]

    let inputColumns

    if (link)
      inputColumns = processNode(module, module.nodes[link.from], trackingObj)
    else
      inputColumns = []
      
    inputsColumns.push(inputColumns)
  }


  

  if (node.type in nodeProcessing)
    nodeColumns = nodeProcessing[node.type](node, inputsColumns, trackingObj)
  else if (inputsColumns.length > 0)
    nodeColumns = inputsColumns[0]
  else
    nodeColumns = []

  trackingObj.nodeColumns[`${module.id}, ${node.id}`] = nodeColumns

  return nodeColumns
}




let nodeProcessing = {}




nodeProcessing['table'] = (node, inputsColumns, trackingObj) => {
  return node.props.columns.split(',').forEach(value => value.trim())
}
nodeProcessing['node'] = (node, inputsColumns, trackingObj) => {
  let parts = node.props.nodeName.split('.', 2)

  let refModule = trackingObj.store.state.project.modules.find(module => module.name === parts[0])

  let refNode
  if (refModule != null)
    refNode = Object.values(refModule.nodes).find(node => node.props.name === parts[1])

  if (refNode == null)
    return []

  return processNode(refModule, refNode, trackingObj)
}
nodeProcessing['sql'] = (node, inputsColumns, trackingObj) => {
  return node.props.columns.split(',').forEach(value => value.trim())
}




function joinProcessing(node, inputsColumns, trackingObj) {
  return inputsColumns[0].concat(inputsColumns[1])
}

nodeProcessing['inner-join'] = joinProcessing
nodeProcessing['left-join'] = joinProcessing
nodeProcessing['right-join'] = joinProcessing
nodeProcessing['full-join'] = joinProcessing
nodeProcessing['cross-join'] = joinProcessing




nodeProcessing['transform'] = (node, inputsColumns, trackingObj) => {
  return node.props.columns.split(',').forEach(value => value.trim())
}