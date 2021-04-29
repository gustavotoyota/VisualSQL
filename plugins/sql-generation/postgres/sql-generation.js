export default function generateSQL(treeObj, options) {
  let sqlObj = {}

  sqlObj.treeObj = treeObj
  sqlObj.options = options ?? {}
  
  sqlObj.sql = ''

  if (options.indentWithSpaces)
    sqlObj.indentation = ' '.repeat(options.indentSize)
  else
    sqlObj.indentation = '\t'
  
  processCommons(sqlObj)

  processObject(treeObj.rootObj, sqlObj, 0)

  return sqlObj
}




function processCommons(sqlObj) {
  if (sqlObj.treeObj.commons.length === 0)
    return

  printLine(sqlObj, 'WITH')

  for (let i = 0; i < sqlObj.treeObj.commons.length; ++i) {
    let common = sqlObj.treeObj.commons[i]

    printLine(sqlObj, common.name + ' AS (', 1)

    processObject(common.obj, sqlObj, 2)

    printLine(sqlObj, ')', 1)
  }
}




const objectProcessing = {}

objectProcessing['select'] = (obj, sqlObj, indentLevel) => {
  // SELECT

  printText(sqlObj, 'SELECT', indentLevel)

  if (obj.distinct != null) {
    if (obj.distinct === '')
      printText(sqlObj, ' DISTINCT')
    else
      printText(sqlObj, ` DISTINCT ON (${obj.distinct})`)
  }

  printLine(sqlObj)

  printLines(sqlObj, obj.select, indentLevel + 1)




  // FROM

  printLine(sqlObj, 'FROM', indentLevel)
  processSources(obj, sqlObj, indentLevel + 1)




  // GROUP BY

  if (obj.group != null) {
    printLine(sqlObj, 'GROUP BY', indentLevel)
    printLines(sqlObj, obj.group.columns, indentLevel + 1)

    if (obj.group.condition !== '') {
      printLine(sqlObj, 'HAVING', indentLevel)
      printLines(sqlObj, obj.group.condition, indentLevel + 1)
    }
  }




  // WHERE

  if (obj.where != null) {
    printLine(sqlObj, 'WHERE', indentLevel)

    if (obj.where.length === 1)
      printLines(sqlObj, obj.where[0], indentLevel + 1)
    else {
      printLines(sqlObj, '(' + obj.where[0] + ')', indentLevel + 1)
      for (let i = 1; i < obj.where.length; ++i)
        printLines(sqlObj, `AND (${obj.where[i]})`, indentLevel + 1)
    }
  }




  // ORDER BY

  if (obj.sort != null) {
    printLine(sqlObj, 'ORDER BY', indentLevel)
    printLines(sqlObj, obj.sort, indentLevel + 1)
  }




  // LIMIT

  if (obj.reduce != null) {
    if (obj.reduce.limit != null) {
      printLine(sqlObj, 'FETCH', indentLevel)

      printText(sqlObj, 'FIRST ', indentLevel + 1)
      printText(sqlObj, obj.reduce.limit.value)
      printText(sqlObj, ' ROWS')

      if (obj.reduce.limit.withTies)
        printLine(sqlObj, ' WITH TIES')
      else
        printLine(sqlObj, ' ONLY')
    }

    if (obj.reduce.offset != null) {
      printLine(sqlObj, 'OFFSET', indentLevel)
      printLine(sqlObj, obj.reduce.offset.value, indentLevel + 1)
    }
  }
}
objectProcessing['set-operations'] = (obj, sqlObj, indentLevel) => {
  printLine(sqlObj, '(', indentLevel)
  processObject(obj.sources[0].obj, sqlObj, indentLevel + 1)
  printLine(sqlObj, ')', indentLevel)

  for (let i = 1; i < obj.sources.length; ++i) {
    switch (obj.sources[i].operationType) {
      case 'union':
        if (obj.sources[i].allowDuplicates)
          printLine(sqlObj, 'UNION ALL', indentLevel)
        else
        printLine(sqlObj, 'UNION', indentLevel)
        break
      case 'difference': printLine(sqlObj, 'MINUS', indentLevel); break
      case 'intersection': printLine(sqlObj, 'INTERSECT', indentLevel); break
    }

    printLine(sqlObj, '(', indentLevel)
    processObject(obj.sources[i].obj, sqlObj, indentLevel + 1)
    printLine(sqlObj, ')', indentLevel)
  }
}
objectProcessing['sql'] = (obj, sqlObj, indentLevel) => {
  printLines(sqlObj, obj.sql, indentLevel)
}





function processSources(obj, sqlObj, indentLevel) {
  printText(sqlObj, '', indentLevel)
  
  processSource(obj.from[0], sqlObj, indentLevel)

  if ((obj.from[0].alias ?? '') !== '')
    printText(sqlObj, ` AS ${obj.from[0].alias}`)

  printLine(sqlObj)
  
  
  for (let i = 1; i < obj.from.length; ++i) {
    printText(sqlObj, '', indentLevel)

    switch (obj.from[i].joinType) {
      case 'inner-join': printText(sqlObj, 'INNER JOIN '); break
      case 'left-join': printText(sqlObj, 'LEFT JOIN '); break
      case 'right-join': printText(sqlObj, 'RIGHT JOIN '); break
      case 'full-join': printText(sqlObj, 'FULL JOIN '); break
      case 'cross-join': printText(sqlObj, 'CROSS JOIN '); break
    }

    processSource(obj.from[i], sqlObj, indentLevel)
    
    if (obj.from[i].alias !== '')
      printText(sqlObj, ` AS ${obj.from[i].alias}`)

    if (obj.from[i].joinType !== 'cross-join') {
      printLine(sqlObj, ' ON')
      printText(sqlObj, obj.from[i].joinCondition, indentLevel + 1)
    }

    printLine(sqlObj)
  }
}




const sourceProcessing = {}

sourceProcessing['table'] = (source, sqlObj, indentLevel) => {
  printText(sqlObj, source.tableName)
}
sourceProcessing['common'] = (source, sqlObj, indentLevel) => {
  printText(sqlObj, sqlObj.treeObj.commons[source.commonIdx].name)
}
sourceProcessing['object'] = (source, sqlObj, indentLevel) => {
  if (source.obj.objectType === 'common') {
    printText(sqlObj, sqlObj.treeObj.commons[source.obj.commonIdx].name)
  } else {
    printLine(sqlObj, '(')
  
    processObject(source.obj, sqlObj, indentLevel + 1)
  
    printText(sqlObj, ')', indentLevel)
  }
}





function processObject(obj, sqlObj, indentLevel) {
  objectProcessing[obj.objectType](obj, sqlObj, indentLevel)
}
function processSource(source, sqlObj, indentLevel) {
  sourceProcessing[source.sourceType](source, sqlObj, indentLevel)
}




function printText(sqlObj, text, indentLevel) {
  sqlObj.sql += sqlObj.indentation.repeat(indentLevel ?? 0) + text
}
function printLine(sqlObj, text, indentLevel) {
  printText(sqlObj, (text ?? '') + '\n', indentLevel)
}




function printLines(sqlObj, text, indentLevel) {
  sqlObj.sql += _app.indent(text,
    sqlObj.indentation.repeat(indentLevel ?? 0)) + '\n'
}