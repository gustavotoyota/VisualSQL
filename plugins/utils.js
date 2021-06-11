global._utils = {}




_utils.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
_utils.shallowCopy = (obj) => {
  if (Array.isArray(obj))
    return obj.slice()

  if (obj != null && obj.constructor == Object)
    return Object.assign({}, obj)

  return obj
}
_utils.notSoShallowCopy = (obj) => {
  let result = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj))
    result[key] = _utils.shallowCopy(value)

  return result
}