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

  sqlObj.incrementIndent = () => { ++sqlObj.indentLevel }
  sqlObj.decrementIndent = () => { --sqlObj.indentLevel }




  sqlObj.indent = () => {
    let indentation = sqlObj.indentation.repeat(sqlObj.indentLevel)

    if (!sqlObj.indentNext)
      return

    sqlObj.indentNext = false
    
    sqlObj.sql += indentation
  }




  sqlObj.print = (text, isField) => {
    sqlObj.indent()

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
  



  sqlObj.printLines = (text, initialIndent) => {
    let indentation = sqlObj.indentation.repeat(sqlObj.indentLevel)

    if (initialIndent)
      sqlObj.indent()

    const parts = text.split('\n')
  
    for (let i = 1; i < parts.length; ++i)
      parts[i] = indentation + parts[i]
  
    sqlObj.sql += parts.join('\n') + '\n'

    sqlObj.indentNext = true
  }



  
  printCommons(sqlObj)

  printObj(treeObj.rootObj, sqlObj, 0)

  return sqlObj
}




function printCommons(sqlObj) {
  if (sqlObj.treeObj.commons.length === 0)
    return

  sqlObj.printLine('WITH')

  sqlObj.incrementIndent()

  for (let i = 0; i < sqlObj.treeObj.commons.length; ++i) {
    let common = sqlObj.treeObj.commons[i]

    printIdentifier(common.name, sqlObj)
    sqlObj.printLine(' AS (')

    
    sqlObj.incrementIndent()
    printObj(common.obj, sqlObj)
    sqlObj.decrementIndent()
    

    sqlObj.print(')')
    if (i < sqlObj.treeObj.commons.length - 1)
      sqlObj.print(',')
    sqlObj.printLine()
  }

  sqlObj.decrementIndent()
}





// Object printing

const objectPrinting = {}

objectPrinting['set-operations'] = (obj, sqlObj) => {
  function printSource(sourceObj) {
    sqlObj.printLine('(')
    sqlObj.incrementIndent()
    printObj(sourceObj.obj, sqlObj)
    sqlObj.decrementIndent()
    sqlObj.printLine(')')
  }



  printSource(obj.sources[0])



  for (let i = 1; i < obj.sources.length; ++i) {
    let sourceObj = obj.sources[i]


    
    switch (sourceObj.operationType) {
      case 'union':
        sqlObj.print('UNION')
        if (sourceObj.allowDuplicates)
          sqlObj.print(' ALL')
        break
      case 'difference': sqlObj.print('EXCEPT'); break
      case 'intersection': sqlObj.print('INTERSECT'); break
    }
    
    sqlObj.printLine()



    printSource(sourceObj)
  }
}
objectPrinting['sql'] = (obj, sqlObj) => {
  sqlObj.printLines(obj.sql, true)
}
objectPrinting['select'] = (obj, sqlObj) => {
  function printSelectClause(obj, sqlObj) {
    sqlObj.print('SELECT')
    if (obj.distinct)
      sqlObj.print(' DISTINCT')
  
    sqlObj.printLine()
  
    sqlObj.incrementIndent()
    sqlObj.printLines(obj.select, true)
    sqlObj.decrementIndent()
  }
  function printFromClause(obj, sqlObj) {
    function printSource(sourceObj) {
      printSourceObj(sourceObj, sqlObj)
      
      if (sourceObj.alias || sourceObj.sourceType === 'object') {
        sqlObj.print(' AS ')
        printIdentifier(sourceObj.alias, sqlObj)
      }
    }



    sqlObj.printLine('FROM')
  
    sqlObj.incrementIndent()
  
    printSource(obj.from[0])
  
    sqlObj.printLine()
    
    
    for (let i = 1; i < obj.from.length; ++i) {
      let sourceObj = obj.from[i]
  
      switch (sourceObj.joinType) {
        case 'inner-join': sqlObj.print('INNER JOIN '); break
        case 'left-join': sqlObj.print('LEFT JOIN '); break
        case 'right-join': sqlObj.print('RIGHT JOIN '); break
        case 'full-join': sqlObj.print('FULL JOIN '); break
        case 'cross-join': sqlObj.print('CROSS JOIN '); break
      }
  
      printSource(sourceObj)
  
      if (sourceObj.joinType !== 'cross-join') {
        sqlObj.printLine(' ON')
  
        sqlObj.incrementIndent()
        sqlObj.print(sourceObj.joinCondition, true)
        sqlObj.decrementIndent()
      }
  
      sqlObj.printLine()
    }
  
    sqlObj.decrementIndent()
  }
  function printWhereClause(obj, sqlObj) {
    if (!obj.where)
      return
  
    sqlObj.printLine('WHERE')
  
    sqlObj.incrementIndent()
  
    if (obj.where.length === 1)
      sqlObj.printLines(obj.where[0], true)
    else {
      sqlObj.printLines(`(${obj.where[0]})`, true)
      for (let i = 1; i < obj.where.length; ++i) {
        sqlObj.print('AND (')
        sqlObj.printLines(`${obj.where[i]})`)
      }
    }
  
    sqlObj.decrementIndent()
  }
  function printGroupByClause(obj, sqlObj) {
    if (!obj.group)
      return
  
    sqlObj.printLine('GROUP BY')
  
    sqlObj.incrementIndent()
    sqlObj.printLines(obj.group.columns, true)
    sqlObj.decrementIndent()
  
    if (obj.group.condition !== '') {
      sqlObj.printLine('HAVING')
  
      sqlObj.incrementIndent()
      sqlObj.printLines(obj.group.condition, true)
      sqlObj.decrementIndent()
    }
  }
  function printOrderByClause(obj, sqlObj) {
    if (!obj.sort)
      return
  
    sqlObj.printLine('ORDER BY')
  
    sqlObj.incrementIndent()
    sqlObj.printLines(obj.sort, true)
    sqlObj.decrementIndent()
  }
  function printLimitClause(obj, sqlObj) {
    if (obj.offset) {
      sqlObj.printLine('OFFSET')
      
      sqlObj.incrementIndent()
  
      sqlObj.print(obj.offset, true)
      sqlObj.printLine(' ROWS')
  
      sqlObj.decrementIndent()
    }
  
    if (obj.limit && obj.limit.value) {
      sqlObj.printLine('FETCH')
  
      sqlObj.incrementIndent()
  
      sqlObj.print('FIRST ')
      sqlObj.print(obj.limit.value, true)
      sqlObj.printLine(' ROWS ONLY')
        
      sqlObj.decrementIndent()
    }
  }




  // Select clauses
  
  printSelectClause(obj, sqlObj)
  printFromClause(obj, sqlObj)
  printWhereClause(obj, sqlObj)
  printGroupByClause(obj, sqlObj)
  printOrderByClause(obj, sqlObj)
  printLimitClause(obj, sqlObj)
}





// Source printing

const sourcePrinting = {}

sourcePrinting['table'] = (sourceObj, sqlObj) => {
  printIdentifier(sourceObj.tableName, sqlObj)
}
sourcePrinting['common'] = (sourceObj, sqlObj) => {
  printIdentifier(sqlObj.treeObj.commons[sourceObj.commonIdx].name, sqlObj)
}
sourcePrinting['object'] = (sourceObj, sqlObj) => {
  sqlObj.printLine('(')

  sqlObj.incrementIndent()
  printObj(sourceObj.obj, sqlObj)
  sqlObj.decrementIndent()

  sqlObj.print(')')
}





function printObj(obj, sqlObj) {
  objectPrinting[obj.objectType](obj, sqlObj)
}
function printSourceObj(sourceObj, sqlObj) {
  sourcePrinting[sourceObj.sourceType](sourceObj, sqlObj)
}




function printIdentifier(identifier, sqlObj) {
  if (identifier)
    sqlObj.print('"' + identifier.replace('"', '""') + '"', true)
  else
    sqlObj.print('<missing>', true)
}