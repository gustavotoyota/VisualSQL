global.$utils = {}

export default (context, inject) => inject('utils', $utils)




$utils.merge = (target, ...objs) => {
  for (const obj of objs) {
    for (const [key, value] of Object.entries(obj)) {
      if (value != null && value.constructor === Object)
        target[key] = $utils.merge(target[key] ?? {}, value)
      else
        target[key] = value
    }
  }

  return target
}
$utils.merged = (...objs) => {
  const result = {}
  
  for (const obj of objs) {
    for (const [key, value] of Object.entries(obj)) {
      if (value != null && value.constructor === Object)
        result[key] = $utils.merged(result[key] ?? {}, value)
      else
        result[key] = value
    }
  }
  
  return result
}




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




$utils.writeToClipboard = function (text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
    return
  }
  
  if (window.clipboardData) {
    clipboardData.setData('Text', text)
    return
  }

  if (document.queryCommandSupported
  && document.queryCommandSupported('copy')) {
    const elem = document.createElement('span')
  
    elem.textContent = text
  
    elem.style.whiteSpace = 'pre'
    elem.style.webkitUserSelect = 'auto'
    elem.style.userSelect = 'all'
  
    document.body.appendChild(elem)
  
    const selection = window.getSelection()
    const range = document.createRange()
    selection.removeAllRanges()
    range.selectNode(elem)
    selection.addRange(range)

    document.execCommand('copy')

    selection.removeAllRanges()
    document.body.removeChild(elem)
    
    return
  }
}
$utils.readFromClipboard = async function () {
  if (navigator.clipboard && navigator.clipboard.readText)
    return await navigator.clipboard.readText()

  if (window.clipboardData)
    return clipboardData.getData('Text')

  if (document.queryCommandSupported
  && document.queryCommandSupported('paste')) {
    const elem = document.createElement('textarea')

    document.body.appendChild(elem)

    elem.focus()

    document.execCommand('paste')

    const text = elem.value

    document.body.removeChild(elem)
    
    return text
  }

  return ''
}