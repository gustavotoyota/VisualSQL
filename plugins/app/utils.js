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




utils.getDisplayPos = function (event) {
  let displayRect = _app.getDisplayRect()
  
  return {
    x: event.pageX - displayRect.left,
    y: event.pageY - displayRect.top
  }
}




utils.worldToScreen = function (module, worldPos) {
  let displayRect = _app.getDisplayRect()

  return {
    x: displayRect.width / 2 + (worldPos.x - module.camera.pos.x) * module.camera.zoom,
    y: displayRect.height / 2 + (worldPos.y - module.camera.pos.y) * module.camera.zoom,
  }
}
utils.screenToWorld = function (module, screenPos) {
  let displayRect = _app.getDisplayRect()

  return {
    x: module.camera.pos.x + (screenPos.x - displayRect.width / 2) / module.camera.zoom,
    y: module.camera.pos.y + (screenPos.y - displayRect.height / 2) / module.camera.zoom,
  }
}




export default utils