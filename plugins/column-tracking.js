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
}
nodeProcessing['node'] = (node, inputsColumns, trackingObj) => {
}
nodeProcessing['sql'] = (node, inputsColumns, trackingObj) => {
}




function joinProcessing(node, inputsColumns, trackingObj) {
}

nodeProcessing['inner-join'] = joinProcessing
nodeProcessing['left-join'] = joinProcessing
nodeProcessing['right-join'] = joinProcessing
nodeProcessing['full-join'] = joinProcessing
nodeProcessing['cross-join'] = joinProcessing




nodeProcessing['transform'] = (node, inputsColumns, trackingObj) => {
}