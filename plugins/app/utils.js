const utils = {}
export default utils




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