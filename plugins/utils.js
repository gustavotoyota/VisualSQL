global.$utils = {}




$utils.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
$utils.shallowCopy = (obj) => {
  if (Array.isArray(obj))
    return obj.slice()

  if (obj != null && obj.constructor == Object)
    return Object.assign({}, obj)

  return obj
}
$utils.notSoShallowCopy = (obj) => {
  let result = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj))
    result[key] = $utils.shallowCopy(value)

  return result
}




$utils.arrayUnion = (array1, array2) => {
  const result = array1.slice()

  for (const item of array2)
    if (!result.includes(item))
      result.push(item)
  
  return result
}
$utils.trimItems = (array) => {
  return array.map(function (value, index, array) {
    return value.trim()
  })
}