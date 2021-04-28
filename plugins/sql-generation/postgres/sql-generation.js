export default function generateSQL(treeObj, options) {
  let sqlObj = {}

  sqlObj.treeObj = treeObj
  sqlObj.options = options ?? {}
  
  sqlObj.sql = ''
  sqlObj.indentation = '  '
  
  processCommons(sqlObj)

  processObject(treeObj.rootObj, sqlObj, 0)

  return sqlObj
}




function processCommons(sqlObj) {
  if (sqlObj.treeObj.commons.length === 0)
    return

  printLine(sqlObj, 0, 'WITH')

  for (let i = 0; i < sqlObj.treeObj.commons.length; ++i) {
    let common = sqlObj.treeObj.commons[i]

    printLine(sqlObj, 1, common.name + ' AS (')
    processObject(common.obj, sqlObj, 2)
    printLine(sqlObj, 1, ')')
  }
}




const objectProcessing = {}

objectProcessing['select'] = (obj, sqlObj, indentLevel) => {
  printLine(sqlObj, indentLevel, 'SELECT')

  printLines(sqlObj, indentLevel + 1, obj.select ?? '*')

  printLine(sqlObj, indentLevel, 'FROM')
  processSources(obj, sqlObj, indentLevel + 1)

  if (obj.group != null) {
    printLine(sqlObj, indentLevel, 'GROUP BY')
    printLines(sqlObj, indentLevel + 1, obj.group.columns)

    if (obj.group.condition !== '') {
      printLine(sqlObj, indentLevel, 'HAVING')
      printLines(sqlObj, indentLevel + 1, obj.group.condition)
    }
  }

  if (obj.where != null) {
    printLine(sqlObj, indentLevel, 'WHERE')

    if (obj.where.length === 1)
      printLines(sqlObj, indentLevel + 1, obj.where[0])
    else {
      printLines(sqlObj, indentLevel + 1, '(' + obj.where[0] + ')')
      for (let i = 1; i < obj.where.length; ++i)
        printLines(sqlObj, indentLevel + 1, `AND (${obj.where[i]})`)
    }
  }

  if (obj.sort != null) {
    printLine(sqlObj, indentLevel, 'ORDER BY')
    printLines(sqlObj, indentLevel + 1, obj.sort)
  }

  if (obj.reduce != null) {
    if (obj.reduce.limit != null) {
      printLine(sqlObj, indentLevel, 'LIMIT')
      printLines(sqlObj, indentLevel + 1, obj.reduce.limit.value.toString())
    }

    if (obj.reduce.offset != null) {
      printLine(sqlObj, indentLevel, 'OFFSET')
      printLines(sqlObj, indentLevel + 1, obj.reduce.offset.toString())
    }
  }
}
objectProcessing['common'] = (obj, sqlObj, indentLevel) => {
  printLine(sqlObj, indentLevel, 'SELECT')
  printLine(sqlObj, indentLevel + 1, '*')
  printLine(sqlObj, indentLevel, 'FROM')
  printLine(sqlObj, indentLevel + 1, sqlObj.treeObj.commons[obj.commonIdx].name)
}
objectProcessing['set-operations'] = (obj, sqlObj, indentLevel) => {
  printLine(sqlObj, indentLevel, '(')
  processObject(obj.sources[0].obj, sqlObj, indentLevel + 1)
  printLine(sqlObj, indentLevel, ')')

  for (let i = 1; i < obj.sources.length; ++i) {
    switch (obj.sources[i].operationType) {
      case 'union':
        if (obj.sources[i].allowDuplicates)
          printLine(sqlObj, indentLevel, 'UNION ALL')
        else
        printLine(sqlObj, indentLevel, 'UNION')
        break
      case 'difference': printLine(sqlObj, indentLevel, 'MINUS'); break
      case 'intersection': printLine(sqlObj, indentLevel, 'INTERSECT'); break
    }

    printLine(sqlObj, indentLevel, '(')
    processObject(obj.sources[i].obj, sqlObj, indentLevel + 1)
    printLine(sqlObj, indentLevel, ')')
  }
}
objectProcessing['sql'] = (obj, sqlObj, indentLevel) => {
  printLines(sqlObj, indentLevel, obj.sql)
}





function processSources(obj, sqlObj, indentLevel) {
  printText(sqlObj, indentLevel, '')
  
  processSource(obj.from[0], sqlObj, indentLevel)

  if ((obj.from[0].alias ?? '') !== '')
    printText(sqlObj, 0, ` AS ${obj.from[0].alias}`)

  printLine(sqlObj, 0, '')
  
  
  for (let i = 1; i < obj.from.length; ++i) {
    printText(sqlObj, indentLevel, '')

    switch (obj.from[i].joinType) {
      case 'inner-join': printText(sqlObj, 0, 'INNER JOIN '); break
      case 'left-join': printText(sqlObj, 0, 'LEFT JOIN '); break
      case 'right-join': printText(sqlObj, 0, 'RIGHT JOIN '); break
      case 'full-join': printText(sqlObj, 0, 'FULL JOIN '); break
      case 'cross-join': printText(sqlObj, 0, 'CROSS JOIN '); break
    }

    processSource(obj.from[i], sqlObj, indentLevel)
    
    if (obj.from[i].alias !== '')
      printText(sqlObj, 0, ` AS ${obj.from[i].alias}`)

    printLine(sqlObj, 0, ' ON')
    printText(sqlObj, indentLevel + 1, obj.from[i].joinCondition)

    printLine(sqlObj, 0, '')
  }
}




const sourceProcessing = {}

sourceProcessing['table'] = (source, sqlObj, indentLevel) => {
  printText(sqlObj, 0, source.tableName)
}
sourceProcessing['common'] = (source, sqlObj, indentLevel) => {
  printText(sqlObj, 0, sqlObj.treeObj.commons[source.commonIdx].name)
}
sourceProcessing['object'] = (source, sqlObj, indentLevel) => {
  if (source.obj.objectType === 'common') {
    printText(sqlObj, 0, sqlObj.treeObj.commons[source.obj.commonIdx].name)
  } else {
    printLine(sqlObj, 0, '(')
  
    processObject(source.obj, sqlObj, indentLevel + 1)
  
    printText(sqlObj, indentLevel, ')')
  }
}





function processObject(obj, sqlObj, indentLevel) {
  objectProcessing[obj.objectType](obj, sqlObj, indentLevel)
}
function processSource(source, sqlObj, indentLevel) {
  sourceProcessing[source.sourceType](source, sqlObj, indentLevel)
}




function printText(sqlObj, indentLevel, text) {
  sqlObj.sql += sqlObj.indentation.repeat(indentLevel) + text
}
function printLine(sqlObj, indentLevel, text) {
  printText(sqlObj, indentLevel, text + '\n')
}
function printLines(sqlObj, indentLevel, text) {
  printLine(sqlObj, 0, _app.indent(text, sqlObj.indentation.repeat(indentLevel)))
}