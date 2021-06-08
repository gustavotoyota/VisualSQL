const utils = {}




utils.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
utils.shallowCopy = (obj) => {
  if (Array.isArray(obj))
    return obj.slice()

  if (obj != null && obj.constructor == Object)
    return Object.assign({}, obj)

  return obj
}
utils.notSoShallowCopy = (obj) => {
  let result = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj))
    result[key] = _app.shallowCopy(value)

  return result
}




utils.getDisplayElem = function () {
  return document.getElementById(`display-${$nuxt.$store.state.project.tabId}`)
}
utils.getDisplayRect = function () {
  return _app.getDisplayElem().getBoundingClientRect()
}




utils.getPointerPos = function (event) {
  let displayRect = _app.getDisplayRect()
  
  return {
    x: event.pageX - displayRect.left,
    y: event.pageY - displayRect.top
  }
}




utils.worldToScreen = function (tab, worldPos) {
  let tabRect = _app.getDisplayRect()

  return {
    x: tabRect.width / 2 + (worldPos.x - tab.camera.pos.x) * tab.camera.zoom,
    y: tabRect.height / 2 + (worldPos.y - tab.camera.pos.y) * tab.camera.zoom,
  }
}
utils.screenToWorld = function (tab, screenPos) {
  let tabRect = _app.getDisplayRect()

  return {
    x: tab.camera.pos.x + (screenPos.x - tabRect.width / 2) / tab.camera.zoom,
    y: tab.camera.pos.y + (screenPos.y - tabRect.height / 2) / tab.camera.zoom,
  }
}




export default utils