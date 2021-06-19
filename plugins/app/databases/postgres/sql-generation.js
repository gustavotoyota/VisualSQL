export default function generateSQL(treeObj, options) {
  const sqlObj = new SQLObj(treeObj, options)

  sqlObj.printCommons()

  sqlObj.printObj(treeObj.rootObj)

  return sqlObj
}





function SQLObj(treeObj, options) {
  this.treeObj = treeObj
  this.options = options ?? {}
  
  this.sql = ''




  // Indentation

  if (options.indentWithSpaces)
    this.indentation = ' '.repeat(options.indentSize)
  else
    this.indentation = '\t'

  this.indentLevel = 0
  this.indentNext = true
}





SQLObj.prototype.printCommons = function () {
  if (this.treeObj.commons.length === 0)
    return

  this.printLine('WITH')

  this.incrementIndent()

  for (let i = 0; i < this.treeObj.commons.length; ++i) {
    let common = this.treeObj.commons[i]

    this.printIdentifier(common.name)
    this.printLine(' AS (')

    
    this.incrementIndent()
    this.printObj(common.obj)
    this.decrementIndent()
    

    this.print(')')
    if (i < this.treeObj.commons.length - 1)
      this.print(',')
    this.printLine()
  }

  this.decrementIndent()
}





// Object printing

SQLObj.prototype.objectPrinting = {}




SQLObj.prototype.printObj = function (obj) {
  this.objectPrinting[obj.objectType].call(this, obj)
}




SQLObj.prototype.objectPrinting['set-operations'] = function (obj) {
  const printSource = (sourceObj) => {
    this.printLine('(')
    this.incrementIndent()
    this.printObj(sourceObj.obj)
    this.decrementIndent()
    this.printLine(')')
  }



  printSource(obj.sources[0])



  for (let i = 1; i < obj.sources.length; ++i) {
    let sourceObj = obj.sources[i]


    
    switch (sourceObj.operationType) {
      case 'union':
        this.print('UNION')
        if (sourceObj.allowDuplicates)
          this.print(' ALL')
        break
      case 'difference': this.print('EXCEPT'); break
      case 'intersection': this.print('INTERSECT'); break
    }
    
    this.printLine()



    printSource(sourceObj)
  }
}
SQLObj.prototype.objectPrinting['sql'] = function (obj) {
  this.printLine(obj.sql, true)
}
SQLObj.prototype.objectPrinting['select'] = function (obj) {
  const printSelectClause = (obj) => {
    this.print('SELECT')
    if (obj.distinct)
      this.print(' DISTINCT')
  
    this.printLine()
  
    this.incrementIndent()
    this.printLine(obj.select, true)
    this.decrementIndent()
  }
  const printFromClause = (obj) => {
    const printSource = (sourceObj) => {
      this.printSourceObj(sourceObj)
      
      if (sourceObj.alias || sourceObj.sourceType === 'object') {
        this.print(' AS ')
        this.printIdentifier(sourceObj.alias)
      }
    }



    this.printLine('FROM')
  
    this.incrementIndent()
  
    printSource(obj.from[0])
  
    this.printLine()
    
    
    for (let i = 1; i < obj.from.length; ++i) {
      let sourceObj = obj.from[i]
  
      switch (sourceObj.joinType) {
        case 'inner-join': this.print('INNER JOIN '); break
        case 'left-join': this.print('LEFT JOIN '); break
        case 'right-join': this.print('RIGHT JOIN '); break
        case 'full-join': this.print('FULL JOIN '); break
        case 'cross-join': this.print('CROSS JOIN '); break
      }
  
      printSource(sourceObj)
  
      if (sourceObj.joinType !== 'cross-join') {
        this.printLine(' ON')
  
        this.incrementIndent()
        this.print(sourceObj.joinCondition, true)
        this.decrementIndent()
      }
  
      this.printLine()
    }
  
    this.decrementIndent()
  }
  const printWhereClause = (obj) => {
    if (!obj.where)
      return
  
    this.printLine('WHERE')
  
    this.incrementIndent()
  
    if (obj.where.length === 1)
      this.printLine(obj.where[0], true)
    else {
      this.printLine(`(${obj.where[0]})`, true)

      for (let i = 1; i < obj.where.length; ++i) {
        this.print('AND ')
        this.printLine(`(${obj.where[i]})`, true)
      }
    }
  
    this.decrementIndent()
  }
  const printGroupByClause = (obj) => {
    if (!obj.group)
      return
  
    this.printLine('GROUP BY')
  
    this.incrementIndent()
    this.printLine(obj.group.columns, true)
    this.decrementIndent()
  
    if (obj.group.condition !== '') {
      this.printLine('HAVING')
  
      this.incrementIndent()
      this.printLine(obj.group.condition, true)
      this.decrementIndent()
    }
  }
  const printOrderByClause = (obj) => {
    if (obj.sort == null)
      return
  
    this.printLine('ORDER BY')
  
    this.incrementIndent()
    this.printLine(obj.sort, true)
    this.decrementIndent()
  }
  const printLimitClause = (obj) => {
    if (obj.offset) {
      this.printLine('OFFSET')
      
      this.incrementIndent()
      this.printLine(obj.offset, true)
      this.decrementIndent()
    }
  
    if (obj.limit && obj.limit.value) {
      this.printLine('FETCH')
  
      this.incrementIndent()
      this.printLine(obj.limit.value, true)
      this.decrementIndent()
    }
  }




  // Select clauses
  
  printSelectClause(obj)
  printFromClause(obj)
  printWhereClause(obj)
  printGroupByClause(obj)
  printOrderByClause(obj)
  printLimitClause(obj)
}





// Source printing

SQLObj.prototype.sourcePrinting = {}




SQLObj.prototype.printSourceObj = function (sourceObj) {
  this.sourcePrinting[sourceObj.sourceType].call(this, sourceObj)
}




SQLObj.prototype.sourcePrinting['table'] = function (sourceObj) {
  this.printIdentifier(sourceObj.tableName)
}
SQLObj.prototype.sourcePrinting['common'] = function (sourceObj) {
  this.printIdentifier(this.treeObj.commons[sourceObj.commonIdx].name)
}
SQLObj.prototype.sourcePrinting['object'] = function (sourceObj) {
  this.printLine('(')

  this.incrementIndent()
  this.printObj(sourceObj.obj)
  this.decrementIndent()

  this.print(')')
}





// Print functionality

SQLObj.prototype.incrementIndent = function () { ++this.indentLevel }
SQLObj.prototype.decrementIndent = function () { --this.indentLevel }





SQLObj.prototype.indent = function (force) {
  if (!this.indentNext && !force)
    return

  this.indentNext = false

  this.sql += this.indentation.repeat(this.indentLevel)
}




SQLObj.prototype.print = function (text, isField) {
  if (!isField) {
    if (this.options.uppercaseKeywords)
      text = text.toUpperCase()
    else
      text = text.toLowerCase()
  }

  this.indent()

  const parts = text.split('\n')

  if (isField && text.trim() === '') {
    this.sql += '<missing field>'

    if (parts.length > 1)
      this.sql += '\n'

    return
  }

  this.sql += parts[0]

  for (let i = 1; i < parts.length; ++i) {
    this.sql += '\n'
    
    if (parts[i] === '')
      continue

    this.indent(true)

    this.sql += parts[i]
  }
}
SQLObj.prototype.printLine = function (text, isField) {
  this.print((text ?? '') + '\n', isField)

  this.indentNext = true
}




SQLObj.prototype.printIdentifier = function (identifier) {
  if (identifier)
    this.print('"' + identifier.replace('"', '""') + '"', true)
  else
    this.print('', true)
}