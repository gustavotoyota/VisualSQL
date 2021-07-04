export default Lexer



function Lexer() {
  this.skip = {
    active: false,
    pattern: '',
  }

  this.text = ''
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
  if (this.skip.active)
    return (new RegExp(`^(${this.skip.pattern})*$`)).test(this.view)
  else
    return this.cursor >= this.text.length
}



Lexer.prototype.check = function (...patterns) {
  for (const pattern of convertPatterns(patterns)) {
    const regex = (() => {
      if (this.skip.active)
        return new RegExp(`^(${this.skip.pattern})*?${pattern}`)
      else
        return new RegExp(`^${pattern}`)
    })()

    const match = this.view.match(regex)

    if (match == null)
      continue
    
    return match[0]
  }
    
  return ''
}
Lexer.prototype.accept = function (...patterns) {
  const result = this.check(...patterns)

  this.advanceView(result.length)

  return result
}
Lexer.prototype.acceptNot = function (...patterns) {
  return this.accept(new RegExp(`[^]*?(?=${
    convertPatterns(patterns).join('|')}|$)`))
}
Lexer.prototype.assert = function (...patterns) {
  const result = this.check(...patterns)

  if (!result)
    throw 'Expected pattern(s) not found.'

  return result
}
Lexer.prototype.eat = function (...patterns) {
  const result = this.accept(...patterns)

  if (!result)
    throw 'Expected pattern(s) not found.'

  return result
}




Lexer.prototype.toggleSkip = function (func) {
  this.skip.active = !this.skip.active

  func()

  this.skip.active = !this.skip.active
}




function convertPatterns(patterns) {
  for (let i = 0; i < patterns.length; ++i)
    if (patterns[i] instanceof RegExp)
      patterns[i] = patterns[i].source

  return patterns
}