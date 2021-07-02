export default Lexer



function Lexer() {
  this.text = ''

  this.cursor = 0
  this.view = ''
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



Lexer.prototype.check = function (...tokens) {
  for (const token of tokens)
    if (new RegExp(`^${token.source}`).test(this.view))
      return true
    
  return false
}
Lexer.prototype.accept = function (...tokens) {
  for (const token of tokens) {
    const match = this.view.match(new RegExp(`^${token.source}`))

    if (match == null)
      continue

    this.advanceView(match[0].length)
    
    return match[0]
  }

  return ''
}
Lexer.prototype.acceptNot = function (...tokens) {
  const patterns = []
  for (const token of tokens)
    patterns.push(token.source)

  const pattern = new RegExp(`^[^]*?(?=${patterns.join('|')}|$)`)

  const match = this.view.match(pattern)

  if (match == null)
    return ''

  this.advanceView(match[0].length)

  return match[0]
}
Lexer.prototype.assert = function (...tokens) {
  const result = this.check(...tokens)

  if (!result)
    throw 'Expected token(s) not found.'

  return result
}
Lexer.prototype.eat = function (...tokens) {
  const result = this.accept(...tokens)

  if (!result)
    throw 'Expected token(s) not found.'

  return result
}