import Lexer from './lexer'




export default function (text, first) {
  const lexer = new Lexer()



  lexer.addToken('Char', /./)
  
  lexer.addToken('Backslash', /\\/)

  lexer.addToken('DoubleQuote', /"/)
  lexer.addToken('NonDoubleQuoteEscape', /[^\\"]+/)
  
  lexer.addToken('SingleQuote', /'/)
  lexer.addToken('NonSingleQuoteEscape', /[^\\']+/)

  lexer.addToken('BackTick', /`/)
  lexer.addToken('NonBackTickEscape', /[^`]+/)

  lexer.addToken('LeftBracket', /\[/)
  lexer.addToken('RightBracket', /\]/)
  lexer.addToken('NonBracketEscape', /[^\]]+/)

  lexer.addToken('LeftParen', /\(/)
  lexer.addToken('RightParen', /\)/)

  lexer.addToken('Comma', /,/)

  lexer.addToken('Identifier', /\w+/)



  lexer.reset(text)



  try {
    return parseColumns(lexer, first)
  } catch {
    return []
  }
}




function parseColumns(lexer, first) {
  const columns = []

  do {
    columns.push(parseColumn(lexer, first))

    lexer.accept('Comma')
  } while (!lexer.isEOF())

  return columns
}

function parseColumn(lexer, first) {
  let firstValue = ''

  while (!lexer.check('Comma') && !lexer.isEOF()) {
    if (lexer.check('DoubleQuote'))
      firstValue = choose(firstValue, parseDoubleQuotes(lexer), first)

    if (lexer.check('SingleQuote'))
      firstValue = choose(firstValue, parseSingleQuotes(lexer), first)

    if (lexer.check('BackTick'))
      firstValue = choose(firstValue, parseBackTicks(lexer), first)

    if (lexer.check('LeftBracket'))
      firstValue = choose(firstValue, parseBrackets(lexer), first)

    if (lexer.check('LeftParen'))
      firstValue = choose(firstValue, parseParens(lexer), first)

    const identifier = lexer.accept('Identifier')

    if (identifier.toUpperCase() === 'FROM') {
      lexer.cursor = lexer.text.length
      return firstValue
    }
    
    firstValue = choose(firstValue, identifier, first)

    lexer.acceptNot('Comma', 'DoubleQuote', 'SingleQuote',
      'BackTick', 'LeftBracket', 'LeftParen', 'Identifier')
  }

  return firstValue
}

function parseDoubleQuotes(lexer) {
  let value = ''

  lexer.eat('DoubleQuote')

  while (true) {
    value += lexer.accept('NonDoubleQuoteEscape')

    if (lexer.isEOF())
      throw 'Unclosed literal.'
    
    if (lexer.eat('DoubleQuote', 'Backslash') === '"') {
      if (lexer.accept('DoubleQuote'))
        value += '"'
      else
        break
    } else
      value += lexer.eat('Char')
  }

  return value
}

function parseSingleQuotes(lexer) {
  let value = ''

  lexer.eat('SingleQuote')

  while (true) {
    value += lexer.accept('NonSingleQuoteEscape')

    if (lexer.isEOF())
      throw 'Unclosed literal.'
    
    if (lexer.eat('SingleQuote', 'Backslash') === '\'') {
      if (lexer.accept('SingleQuote'))
        value += '\''
      else
        break
    } else
      value += lexer.eat('Char')
  }

  return value
}

function parseBackTicks(lexer) {
  let value = ''

  lexer.eat('BackTick')

  while (true) {
    value += lexer.accept('NonBackTickEscape')

    if (lexer.isEOF())
      throw 'Unclosed literal.'

    lexer.eat('BackTick')
    
    if (!lexer.accept('BackTick'))
      break

    value += '`'
  }

  return value
}

function parseBrackets(lexer) {
  let value = ''

  lexer.eat('LeftBracket')

  while (true) {
    value += lexer.accept('NonBracketEscape')

    if (lexer.isEOF())
      throw 'Unclosed literal.'

    lexer.eat('RightBracket')
    
    if (!lexer.accept('RightBracket'))
      break

    value += ']'
  }

  return value
}

function parseParens(lexer) {
  lexer.eat('LeftParen')

  while (!lexer.accept('RightParen')) {
    if (lexer.check('DoubleQuote'))
      parseDoubleQuotes(lexer)

    if (lexer.check('SingleQuote'))
      parseSingleQuotes(lexer)

    if (lexer.check('BackTick'))
      parseBackTicks(lexer)

    if (lexer.check('LeftBracket'))
      parseBrackets(lexer)

    if (lexer.check('LeftParen'))
      parseParens(lexer)
    
    lexer.accept('Identifier')
    
    lexer.acceptNot('RightParen', 'DoubleQuote', 'SingleQuote',
      'BackTick', 'LeftBracket', 'LeftParen', 'Identifier')
  }

  return ''
}

function choose(value1, value2, first) {
  if ((first && value1) || !value2)
    return value1
    
  return value2
}