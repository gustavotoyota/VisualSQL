export default function generateSQL(treeObj, options) {
  let sqlObj = {}

  sqlObj.treeObj = treeObj
  sqlObj.options = options ?? {}
  
  sqlObj.sql = ''




  // Indentation

  if (options.indentWithSpaces)
    sqlObj.indentation = ' '.repeat(options.indentSize)
  else
    sqlObj.indentation = '\t'

  sqlObj.indentLevel = 0
  sqlObj.indentNext = true




  // Print functions

  sqlObj.incrementIndent = () => {
    ++sqlObj.indentLevel
  }
  sqlObj.decrementIndent = () => {
    --sqlObj.indentLevel
  }

  sqlObj.print = (text, isField) => {
    if (sqlObj.indentNext)
      sqlObj.sql += sqlObj.indentation.repeat(sqlObj.indentLevel)

    sqlObj.indentNext = false

    if (!isField) {
      if (sqlObj.options.uppercaseKeywords)
        text = text.toUpperCase()
      else
        text = text.toLowerCase()
    }

    sqlObj.sql += text
  }
  sqlObj.printLine = (text, isField) => {
    sqlObj.print((text ?? '') + '\n', isField)

    sqlObj.indentNext = true
  }
  
  sqlObj.printLines = (text) => {
    sqlObj.sql += _app.indent(text,
      sqlObj.indentation.repeat(sqlObj.indentLevel)) + '\n'

    sqlObj.indentNext = true
  }



  
  processCommons(sqlObj)

  processObject(treeObj.rootObj, sqlObj, 0)

  return sqlObj
}




function processCommons(sqlObj) {
  if (sqlObj.treeObj.commons.length === 0)
    return

  sqlObj.printLine('WITH')

  sqlObj.incrementIndent()

  for (let i = 0; i < sqlObj.treeObj.commons.length; ++i) {
    let common = sqlObj.treeObj.commons[i]

    sqlObj.print(common.name, true)
    sqlObj.printLine(' AS (')

    
    sqlObj.incrementIndent()
    processObject(common.obj, sqlObj)
    sqlObj.decrementIndent()
    

    sqlObj.printLine(')')
  }

  sqlObj.decrementIndent()
}




const objectProcessing = {}

objectProcessing['select'] = (obj, sqlObj) => {
  // SELECT

  sqlObj.print('SELECT')

  if (obj.distinct != null) {
    if (obj.distinct === '')
      sqlObj.print(' DISTINCT')
    else {
      sqlObj.print(' DISTINCT ON (')
      sqlObj.print(obj.distinct, true)
      sqlObj.print(')')
    }
  }

  sqlObj.printLine()

  sqlObj.incrementIndent()
  sqlObj.printLines(obj.select)
  sqlObj.decrementIndent()




  // FROM

  sqlObj.printLine('FROM')

  sqlObj.incrementIndent()
  processSources(obj, sqlObj)
  sqlObj.decrementIndent()




  // WHERE

  if (obj.where != null) {
    sqlObj.printLine('WHERE')

    sqlObj.incrementIndent()

    if (obj.where.length === 1)
      sqlObj.printLines(obj.where[0])
    else {
      sqlObj.printLines(`(${obj.where[0]})`)
      for (let i = 1; i < obj.where.length; ++i) {
        sqlObj.print('AND (')
        sqlObj.printLines(`${obj.where[i]})`)
      }
    }

    sqlObj.decrementIndent()
  }




  // GROUP BY

  if (obj.group != null) {
    sqlObj.printLine('GROUP BY')

    sqlObj.incrementIndent()
    sqlObj.printLines(obj.group.columns)
    sqlObj.decrementIndent()

    if (obj.group.condition !== '') {
      sqlObj.printLine('HAVING')

      sqlObj.incrementIndent()
      sqlObj.printLines(obj.group.condition)
      sqlObj.decrementIndent()
    }
  }




  // ORDER BY

  if (obj.sort != null) {
    sqlObj.printLine('ORDER BY')

    sqlObj.incrementIndent()
    sqlObj.printLines(obj.sort)
    sqlObj.decrementIndent()
  }




  // LIMIT

  if (obj.reduce != null) {
    if (obj.reduce.limit != null) {
      sqlObj.printLine('FETCH')

      sqlObj.incrementIndent()

      sqlObj.print('FIRST ')
      sqlObj.print(obj.reduce.limit.value, true)
      sqlObj.print(' ROWS')

      if (obj.reduce.limit.withTies)
        sqlObj.printLine(' WITH TIES')
      else
        sqlObj.printLine(' ONLY')
        
      sqlObj.decrementIndent()
    }

    if (obj.reduce.offset != null) {
      sqlObj.printLine('OFFSET')
      
      sqlObj.incrementIndent()
      sqlObj.printLine(obj.reduce.offset.value, true)
      sqlObj.decrementIndent()
    }
  }
}
objectProcessing['set-operations'] = (obj, sqlObj) => {
  sqlObj.printLine('(')
  sqlObj.incrementIndent()
  processObject(obj.sources[0].obj, sqlObj)
  sqlObj.decrementIndent()
  sqlObj.printLine(')')

  for (let i = 1; i < obj.sources.length; ++i) {
    switch (obj.sources[i].operationType) {
      case 'union':
        if (obj.sources[i].allowDuplicates)
          sqlObj.printLine('UNION ALL')
        else
        sqlObj.printLine('UNION')
        break
      case 'difference': sqlObj.printLine('MINUS'); break
      case 'intersection': sqlObj.printLine('INTERSECT'); break
    }

    sqlObj.printLine('(')
    sqlObj.incrementIndent()
    processObject(obj.sources[i].obj, sqlObj)
    sqlObj.decrementIndent()
    sqlObj.printLine(')')
  }
}
objectProcessing['sql'] = (obj, sqlObj) => {
  sqlObj.printLines(obj.sql)
}





function processSources(obj, sqlObj) {
  processSource(obj.from[0], sqlObj)

  if ((obj.from[0].alias ?? '') !== '') {
    sqlObj.print(' AS ')
    sqlObj.print(obj.from[0].alias, true)
  }

  sqlObj.printLine()
  
  
  for (let i = 1; i < obj.from.length; ++i) {
    switch (obj.from[i].joinType) {
      case 'inner-join': sqlObj.print('INNER JOIN '); break
      case 'left-join': sqlObj.print('LEFT JOIN '); break
      case 'right-join': sqlObj.print('RIGHT JOIN '); break
      case 'full-join': sqlObj.print('FULL JOIN '); break
      case 'cross-join': sqlObj.print('CROSS JOIN '); break
    }

    processSource(obj.from[i], sqlObj)
    
    if (obj.from[i].alias !== '') {
      sqlObj.print(' AS ')
      sqlObj.print(obj.from[i].alias, true)
    }

    if (obj.from[i].joinType !== 'cross-join') {
      sqlObj.printLine(' ON')

      sqlObj.incrementIndent()
      sqlObj.print(obj.from[i].joinCondition, true)
      sqlObj.decrementIndent()
    }

    sqlObj.printLine()
  }
}




const sourceProcessing = {}

sourceProcessing['table'] = (source, sqlObj) => {
  sqlObj.print(source.tableName, true)
}
sourceProcessing['common'] = (source, sqlObj) => {
  sqlObj.print(sqlObj.treeObj.commons[source.commonIdx].name, true)
}
sourceProcessing['object'] = (source, sqlObj) => {
  sqlObj.printLine('(')

  sqlObj.incrementIndent()
  processObject(source.obj, sqlObj)
  sqlObj.decrementIndent()

  sqlObj.print(')')
}





function processObject(obj, sqlObj) {
  objectProcessing[obj.objectType](obj, sqlObj)
}
function processSource(source, sqlObj) {
  sourceProcessing[source.sourceType](source, sqlObj)
}