import Lexer from './lexer.js'




// Tokens

const Char = /./

const Backslash = /\\/

const DoubleQuote = /"/
const SingleQuote = /'/
const BackTick = /`/

const LeftBracket = /\[/
const RightBracket = /\]/

const LeftParen = /\(/
const RightParen = /\)/

const Comma = /,/

const Identifier = /\w+/




export default function (text, first) {
  const lexer = new Lexer()

  lexer.reset(text)

  try {
    return parseColumns(first)
  } catch (err) {
    console.log(err)

    return []
  }




  // Parsing

  function parseColumns(first) {
    const columns = []
  
    do {
      columns.push(parseColumn(first))
  
      lexer.accept(Comma)
    } while (!lexer.isEOF())
  
    return columns
  }
  
  function parseColumn(first) {
    let firstValue = ''
  
    while (!lexer.check(Comma) && !lexer.isEOF()) {
      if (lexer.check(DoubleQuote))
        firstValue = choose(firstValue, parseDoubleQuotes(), first)
  
      if (lexer.check(SingleQuote))
        firstValue = choose(firstValue, parseSingleQuotes(), first)
  
      if (lexer.check(BackTick))
        firstValue = choose(firstValue, parseBackTicks(), first)
  
      if (lexer.check(LeftBracket))
        firstValue = choose(firstValue, parseBrackets(), first)
  
      if (lexer.check(LeftParen))
        firstValue = choose(firstValue, parseParens(), first)
  
      const identifier = lexer.accept(Identifier)
  
      if (identifier.toUpperCase() === 'FROM') {
        lexer.cursor = lexer.text.length
        return firstValue
      }
      
      firstValue = choose(firstValue, identifier, first)
  
      lexer.acceptNot(Comma, DoubleQuote, SingleQuote,
        BackTick, LeftBracket, LeftParen, Identifier)
    }
  
    return firstValue
  }
  
  function parseDoubleQuotes() {
    let value = ''
  
    lexer.eat(DoubleQuote)
  
    while (true) {
      value += lexer.acceptNot(DoubleQuote, Backslash)
  
      if (lexer.isEOF())
        throw 'Unclosed literal.'
      
      if (lexer.eat(DoubleQuote, Backslash) === '"') {
        if (lexer.accept(DoubleQuote))
          value += '"'
        else
          break
      } else
        value += lexer.eat(Char)
    }
  
    return value
  }
  
  function parseSingleQuotes() {
    lexer.eat(SingleQuote)
  
    while (true) {
      lexer.acceptNot(SingleQuote, Backslash)
  
      if (lexer.isEOF())
        throw 'Unclosed literal.'
      
      if (lexer.eat(SingleQuote, Backslash) === '\'')
        if (!lexer.accept(SingleQuote))
          break
    }
  
    return ''
  }
  
  function parseBackTicks() {
    let value = ''
  
    lexer.eat(BackTick)
  
    while (true) {
      value += lexer.acceptNot(BackTick)
  
      if (lexer.isEOF())
        throw 'Unclosed literal.'
  
      lexer.eat(BackTick)
      
      if (!lexer.accept(BackTick))
        break
  
      value += '`'
    }
  
    return value
  }
  
  function parseBrackets() {
    let value = ''
  
    lexer.eat(LeftBracket)
  
    while (true) {
      value += lexer.acceptNot(RightBracket)
  
      if (lexer.isEOF())
        throw 'Unclosed literal.'
  
      lexer.eat(RightBracket)
      
      if (!lexer.accept(RightBracket))
        break
  
      value += ']'
    }
  
    return value
  }
  
  function parseParens() {
    lexer.eat(LeftParen)
  
    while (true) {
      if (lexer.isEOF())
        throw 'Unclosed parenthesis.'

      if (lexer.accept(RightParen))
        break

      if (lexer.check(DoubleQuote))
        parseDoubleQuotes()
  
      if (lexer.check(SingleQuote))
        parseSingleQuotes()
  
      if (lexer.check(BackTick))
        parseBackTicks()
  
      if (lexer.check(LeftBracket))
        parseBrackets()
  
      if (lexer.check(LeftParen))
        parseParens()
      
      lexer.accept(Identifier)
      
      lexer.acceptNot(RightParen, DoubleQuote, SingleQuote,
        BackTick, LeftBracket, LeftParen, Identifier)
    }
  
    return ''
  }
  
  function choose(value1, value2, first) {
    if ((first && value1) || !value2)
      return value1
      
    return value2
  }


}