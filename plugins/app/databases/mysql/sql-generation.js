export default function generateSQL(treeObj, options) {
  const sqlObj = new SQLObj(treeObj, options)


  
  const writer = new Writer(sqlObj)

  writer.print(sqlObj.printCommons())

  writer.print(sqlObj.printObj(treeObj.rootObj))

  sqlObj.sql = writer.text



  return sqlObj
}





function SQLObj(treeObj, options) {
  this.treeObj = treeObj

  this.options = options
}





SQLObj.prototype.printCommons = function () {
  if (this.treeObj.commons.length === 0)
    return ''

  const writer = new Writer(this)

  writer.printLine('WITH', true)

  writer.incrementIndent()

  for (let i = 0; i < this.treeObj.commons.length; ++i) {
    const common = this.treeObj.commons[i]

    writer.printIdentifier(common.name)
    writer.printLine(' AS (', true)

    
    writer.incrementIndent()
    writer.print(this.printObj(common.obj))
    writer.decrementIndent()
    

    writer.print(')')

    if (i < this.treeObj.commons.length - 1)
      writer.print(',')

    writer.printLine()
  }

  writer.decrementIndent()

  return writer.text
}





// Object printing

SQLObj.prototype.objectPrinting = {}




SQLObj.prototype.printObj = function (obj) {
  return this.objectPrinting[obj.objectType].call(this, obj)
}




SQLObj.prototype.objectPrinting['set-operations'] = function (obj) {
  const printSource = (sourceObj) => {
    writer.printLine('(')
    writer.incrementIndent()
    writer.print(this.printObj(sourceObj.obj))
    writer.decrementIndent()
    writer.printLine(')')
  }



  const writer = new Writer(this)


  printSource(obj.sources[0])


  for (let i = 1; i < obj.sources.length; ++i) {
    const sourceObj = obj.sources[i]

    
    switch (sourceObj.operationType) {
      case 'union':
        writer.print('UNION', true)
        if (sourceObj.allowDuplicates)
          writer.print(' ALL', true)
        break
      case 'difference': writer.print('EXCEPT', true); break
      case 'intersection': writer.print('INTERSECT', true); break
    }
    
    writer.printLine()


    printSource(sourceObj)
  }


  return writer.text
}
SQLObj.prototype.objectPrinting['sql'] = function (obj) {
  const writer = new Writer(this)

  writer.printField(obj.sql)

  return writer.text
}
SQLObj.prototype.objectPrinting['select'] = function (obj) {
  const printSelectClause = (obj) => {
    writer.print('SELECT', true)

    if (obj.distinct)
      writer.print(' DISTINCT', true)
  
    writer.printLine()
  
    writer.incrementIndent()
    writer.printField(obj.select)
    writer.decrementIndent()
  }
  const printFromClause = (obj) => {
    const printSource = (sourceObj) => {
      writer.print(this.printSourceObj(sourceObj))
      
      if (sourceObj.alias || sourceObj.sourceType === 'object') {
        writer.print(' AS ', true)
        writer.printIdentifier(sourceObj.alias)
      }
    }



    writer.printLine('FROM', true)
  
    writer.incrementIndent()
  
    printSource(obj.from[0])
  
    writer.printLine()
    
    
    for (let i = 1; i < obj.from.length; ++i) {
      const sourceObj = obj.from[i]
  
      switch (sourceObj.joinType) {
        case 'inner-join': writer.print('INNER JOIN ', true); break
        case 'left-join': writer.print('LEFT JOIN ', true); break
        case 'right-join': writer.print('RIGHT JOIN ', true); break
        case 'full-join': writer.print('FULL JOIN ', true); break
        case 'cross-join': writer.print('CROSS JOIN ', true); break
      }
  
      printSource(sourceObj)
  
      if (sourceObj.joinType !== 'cross-join') {
        writer.printLine(' ON', true)
  
        writer.incrementIndent()
        writer.printField(sourceObj.joinCondition)
        writer.decrementIndent()
      }
    }
  
    writer.decrementIndent()
  }
  const printWhereClause = (obj) => {
    if (!obj.where)
      return
  
    writer.printLine('WHERE', true)
  
    writer.incrementIndent()
  
    if (obj.where.length === 1)
      writer.printField(obj.where[0])
    else {
      writer.printField(`(${obj.where[0]})`)

      for (let i = 1; i < obj.where.length; ++i) {
        writer.print('AND ', true)
        writer.printField(`(${obj.where[i]})`)
      }
    }
  
    writer.decrementIndent()
  }
  const printGroupByClause = (obj) => {
    if (!obj.group)
      return
  
    writer.printLine('GROUP BY', true)
  
    writer.incrementIndent()
    writer.printField(obj.group.columns)
    writer.decrementIndent()
  
    if (!isFieldEmpty(obj.group.condition)) {
      writer.printLine('HAVING', true)
  
      writer.incrementIndent()
      writer.printField(obj.group.condition)
      writer.decrementIndent()
    }
  }
  const printOrderByClause = (obj) => {
    if (obj.sort == null)
      return
  
    writer.printLine('ORDER BY', true)

    writer.incrementIndent()
    writer.printField(obj.sort)
    writer.decrementIndent()
  }
  const printLimitClause = (obj) => {
    if (obj.limit) {
      writer.printLine('LIMIT', true)
  
      writer.incrementIndent()
      writer.printField(obj.limit.value)
      writer.decrementIndent()
    }

    if (obj.offset) {
      writer.printLine('OFFSET', true)
      
      writer.incrementIndent()
      writer.printField(obj.offset.value)
      writer.decrementIndent()
    }
  }



  const writer = new Writer(this)

  printSelectClause(obj)
  printFromClause(obj)
  printWhereClause(obj)
  printGroupByClause(obj)
  printOrderByClause(obj)
  printLimitClause(obj)

  return writer.text
}





// Source printing

SQLObj.prototype.sourcePrinting = {}




SQLObj.prototype.printSourceObj = function (sourceObj) {
  return this.sourcePrinting[sourceObj.sourceType].call(this, sourceObj)
}




SQLObj.prototype.sourcePrinting['table'] = function (sourceObj) {
  const writer = new Writer(this)

  writer.printIdentifier(sourceObj.tableName)

  return writer.text
}
SQLObj.prototype.sourcePrinting['common'] = function (sourceObj) {
  const writer = new Writer(this)

  writer.printIdentifier(this.treeObj.commons[sourceObj.commonIdx].name)

  return writer.text
}
SQLObj.prototype.sourcePrinting['object'] = function (sourceObj) {
  const writer = new Writer(this)

  writer.printLine('(')

  writer.incrementIndent()
  writer.print(this.printObj(sourceObj.obj))
  writer.decrementIndent()

  writer.print(')')

  return writer.text
}





// Print functionality

function Writer(sqlObj) {
  this.sqlObj = sqlObj
  
  if (sqlObj.options.indentWithSpaces)
    this.indentation = ' '.repeat(sqlObj.options.indentSize)
  else
    this.indentation = '\t'


  

  this.text = ''

  this.indentLevel = 0
  this.indentNext = true
}





Writer.prototype.incrementIndent = function () { ++this.indentLevel }
Writer.prototype.decrementIndent = function () { --this.indentLevel }





Writer.prototype.indent = function (force) {
  if (!this.indentNext && !force)
    return

  this.indentNext = false

  this.text += this.indentation.repeat(this.indentLevel)
}




Writer.prototype.print = function (text, capitalize) {
  if (capitalize) {
    if (this.sqlObj.options.uppercaseKeywords)
      text = text.toUpperCase()
    else
      text = text.toLowerCase()
  }

  this.indent()

  const parts = text.split('\n')

  this.text += parts[0]

  for (let i = 1; i < parts.length; ++i) {
    this.text += '\n'

    if (i === parts.length - 1 && parts[i] === '') {
      this.indentNext = true
      break
    }

    this.indent(true)

    this.text += parts[i]
  }
}
Writer.prototype.printLine = function (text, capitalize) {
  this.print((text ?? '') + '\n', capitalize)
}




Writer.prototype.printField = function (field) {
  if (isFieldEmpty(field)) {
    this.printLine('<missing field>')
    return
  }

  for (const part of field) {
    if (part.constructor === String) {
      this.print(part)
    } else {
      this.printLine()

      this.incrementIndent()
      this.print(this.sqlObj.printObj(part))
      this.decrementIndent()
    }
  }

  this.printLine()
}




Writer.prototype.printIdentifier = function (identifier) {
  if (identifier)
    this.print('`' + identifier.replace('`', '``') + '`')
  else
    this.print('<missing field>')
}




function isFieldEmpty(field) {
  return field.length === 0 ||
    (field.length === 1 && field[0] === '')
}
function isFieldNumeric(field) {
  return field.length === 1 && !isNaN(field[0]) && field[0]
}