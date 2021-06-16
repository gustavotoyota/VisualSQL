export default Lexer



function Lexer() {
  this.tokens = {}


  
  this.text = ''

  this.cursor = 0
  this.view = ''
}



Lexer.prototype.addToken = function (name, pattern) {
  this.tokens[name] = new RegExp('^' + pattern.source)
}



Lexer.prototype.reset = function (text) {
  this.text = text

  this.updateView(0)
}



Lexer.prototype.updateView = function (cursor) {
  if (cursor != null)
    this.cursor = cursor 

  this.view = this.text.substring(this.cursor)
}
Lexer.prototype.advanceView = function (offset) {
  this.updateView(this.cursor + offset)
}



Lexer.prototype.isEOF = function () {
  return this.cursor >= this.text.length
}



Lexer.prototype.check = function (...tokenNames) {
  for (const tokenName of tokenNames)
    if (this.tokens[tokenName].test(this.view))
      return true
    
  return false
}
Lexer.prototype.accept = function (...tokenNames) {
  for (const tokenName of tokenNames) {
    const match = this.view.match(this.tokens[tokenName])

    if (match == null)
      continue

    this.advanceView(match[0].length)
    
    return match[0]
  }

  return ''
}
Lexer.prototype.acceptNot = function (...tokenNames) {
  const patterns = []
  for (const tokenName of tokenNames)
    patterns.push(this.tokens[tokenName].source.substring(1))

  const pattern = new RegExp('^.*?(?=' + patterns.join('|') + '|$)', 's')

  const match = this.view.match(pattern)

  if (match == null)
    return ''

  this.advanceView(match[0].length)

  return match[0]
}
Lexer.prototype.assert = function (...tokenNames) {
  const result = this.check(...tokenNames)

  if (!result)
    throw 'Expected token(s) not found.'

  return result
}
Lexer.prototype.eat = function (...tokenNames) {
  const result = this.accept(...tokenNames)

  if (!result)
    throw 'Expected token(s) not found.'

  return result
}