import Lexer from '../lexer.js'




// Tokens

const Char = /./

const Backslash = /\\/

const LeftParenthesis = /\(/
const RightParenthesis = /\)/

const DoubleQuote = /"/
const SingleQuote = /'/
const BackTick = /`/

const LeftBracket = /\[/
const RightBracket = /\]/

const PlainIdentifier = /\w+/

const Comma = /,/

const With = /\bWITH\b/
const Select = /\bSELECT\b/
const Distinct = /\bDISTINCT\b/
const Top = /\bTOP\b/
const Percent = /\bPERCENT\b/
const WithTies = /\bWITH\s+TIES\b/
const As = /\bAS\b/
const From = /\bFROM\b/
const On = /\bON\b/
const Where = /\bWHERE\b/
const GroupBy = /\bGROUP\s+BY\b/
const Having = /\bHAVING\b/
const OrderBy = /\bORDER\s+BY\b/
const Limit = /\bLIMIT\b/
const Offset = /\bOFFSET\b/
const Fetch = /\bFETCH\b/

const Union = /\bUNION\b/
const All = /\bALL\b/
const Minus = /\bMINUS\b/
const Except = /\bEXCEPT\b/
const Intersect = /\bINTERSECT\b/

const NonWhitespace = /\S+/





global.parseSQL = parseSQL




function parseSQL(sql) {
  sql = `
    (
      SELECT DISTINCT TOP 10.32123
        col1,
        "c]o'l2",
        \`co"l3\`,
        [c\`o"l4]
      FROM
        table1 AS t1
        INNER JOIN table2 AS t2 ON
          t1.col1 = t2.col2
        INNER JOIN (
          SELECT DISTINCT TOP 10
            col1,
            "c]o'l2",
            \`co"l3\`,
            [c\`o"l4]
          FROM
            table1 AS t1
            INNER JOIN table2 AS t2 ON
              t1.col1 = t2.col2
          WHERE
            t1.col1 = 'hello'
          GROUP BY
            Floor(t1.col5)
          HAVING
            SUM(t1.col5) > 5
          ORDER BY
            col4,
            col5
        ) AS t3 ON
          t1.col1 = t3.col3
      WHERE
        t1.col1 = 'hello'
      GROUP BY
        Floor(t1.col5)
      HAVING
        SUM(t1.col5) > 5
      ORDER BY
        col4,
        col5
    )
    UNION
    (
      SELECT DISTINCT TOP e2313.34816
        col1,
        "c]o'l2",
        \`co"l3\`,
        [c\`o"l4]
      FROM
        table1 AS t1
        INNER JOIN table2 AS t2 ON
          t1.col1 = t2.col2
      WHERE
        t1.col1 = 'hello'
      GROUP BY
        Floor(t1.col5)
      HAVING
        SUM(t1.col5) > 5
      ORDER BY
        col4,
        col5
    )
  `



  const lexer = new Lexer()

  lexer.skip.active = true
  lexer.skip.pattern = '\\s|--.*?[\n$]'
  
  lexer.reset(sql)
  



  const result = {}

  result.commons = parseCommons()

  result.query = parseQuery()

  return result




  function parseCommons() {
    const result = []

    if (!lexer.accept(With))
      return result

    while (true) {
      const common = {}

      common.name = parseIdentifier()

      lexer.eat(As)

      lexer.eat(LeftParenthesis)
      common.query = parseQuery()
      lexer.eat(RightParenthesis)

      result.push(common)

      if (!lexer.accept(Comma))
        break
    }

    return result
  }


  function parseQuery() {
    const result = []

    let part = {}

    while (true) {
      if (lexer.check(Select))
        part.select = parseSelect()
      else {
        lexer.eat(LeftParenthesis)
        part.query = parseQuery()
        lexer.eat(RightParenthesis)
      }

      result.push(part)
      
      part = {}

      part.operation = lexer.accept(Union, Minus, Except, Intersect).toLowerCase().trim()

      if (part.operation === 'union') {
        if (lexer.accept(All))
          part.operation = 'union-all'
      } else if (!part.operation)
        break
    }

    return result
  }
  function parseSelect() {
    const endTokens = [RightParenthesis, Union, Minus, Except, Intersect]




    const result = {}




    // Select

    lexer.eat(Select)

    if (lexer.accept(Distinct)) {
      result.distinct = {}

      if (lexer.accept(On)) {
        lexer.eat(LeftParenthesis)
        result.distinct.columns = parseUntil(RightParenthesis)
        lexer.eat(RightParenthesis)
      }
    }

    if (lexer.accept(Top)) {
      if (lexer.accept(LeftParenthesis)) {
        result.limit = parseUntil(RightParenthesis)
        lexer.eat(RightParenthesis)
      } else
        result.limit = lexer.eat(NonWhitespace)
      
      result.limit += lexer.accept(Percent)
      result.limit += lexer.accept(WithTies)
    }
    
    result.select = parseUntil(From)

    


    // From

    lexer.eat(From)

    result.from = parseUntil(Where, GroupBy,
      OrderBy, Limit, Offset, Fetch, ...endTokens)



  
    // Where

    if (lexer.accept(Where))
      result.where = parseUntil(GroupBy, OrderBy,
        Limit, Offset, Fetch, ...endTokens)




    // Group By

    if (lexer.accept(GroupBy)) {
      result.group = {}

      result.group.columns = parseUntil(
        Having, OrderBy, Limit, Offset, Fetch, ...endTokens)

      if (lexer.accept(Having))
        result.group.condition = parseUntil(
          OrderBy, Limit, Offset, Fetch, ...endTokens)
    }



    
    // Order By

    if (lexer.accept(OrderBy))
      result.sort = parseUntil(Limit, Offset, Fetch, ...endTokens)




    // Limit

    if (lexer.accept(Limit))
      result.limit = parseUntil(Offset, Fetch, ...endTokens)




    // Offset

    if (lexer.accept(Offset))
      result.offset = parseUntil(Fetch, ...endTokens)




    // Fetch

    if (lexer.accept(Fetch))
      result.limit = parseUntil(...endTokens)




    return result
  }


  



  function parseUntil(...endTokens) {
    let result = ''

    while (true) {
      result += lexer.acceptNot(LeftParenthesis, SingleQuote,
        DoubleQuote, BackTick, LeftBracket, ...endTokens)

      if (lexer.check(LeftParenthesis))
        result += parseParentheses()
      else if (lexer.check(SingleQuote))
        result += parseSingleQuotes()
      else if (lexer.check(DoubleQuote))
        result += parseDoubleQuotes(true)
      else if (lexer.check(BackTick))
        result += parseBackTicks(true)
      else if (lexer.check(LeftBracket))
        result += parseBrackets(true)
      else
        break
    }

    return result
  }




  function parseParentheses() {
    let result = ''

    result += lexer.eat(LeftParenthesis)
    result += parseUntil(RightParenthesis)
    result += lexer.eat(RightParenthesis)

    return result
  }
  
  function parseSingleQuotes() {
    let result = ''

    lexer.eat(SingleQuote)

    lexer.toggleSkip(() => {
      while (true) {
        result += lexer.acceptNot(SingleQuote, Backslash)
  
        if (lexer.accept(SingleQuote)) {
          if (lexer.accept(SingleQuote))
            result += "'"
          else
            break
        } else {
          lexer.eat(Backslash)
          result += lexer.eat(Char)
        }
      }
    })

    return "'" + result.replaceAll("'", "''") + "'"
  }





  // Identifier

  function parseIdentifier() {
    if (lexer.check(DoubleQuote))
      return parseDoubleQuotes()

    if (lexer.check(BackTick))
      return parseBackTicks()

    if (lexer.check(LeftBracket))
      return parseBrackets()
    
    return lexer.eat(PlainIdentifier)
  }

  function parseDoubleQuotes(literal) {
    let result = ''

    lexer.eat(DoubleQuote)

    lexer.toggleSkip(() => {
      while (true) {
        result += lexer.acceptNot(DoubleQuote, Backslash)

        if (lexer.accept(DoubleQuote)) {
          if (lexer.accept(DoubleQuote))
            result += '"'
          else
            break
        } else {
          lexer.eat(Backslash)
          result += lexer.eat(Char)
        }
      }
    })

    if (literal)
      result = '"' + result.replaceAll('"', '""') + '"'

    return result
  }
  function parseBackTicks(literal) {
    let result = ''
  
    lexer.eat(BackTick)

    lexer.toggleSkip(() => {
      while (true) {
        result += lexer.acceptNot(BackTick)
    
        lexer.eat(BackTick)
        
        if (!lexer.accept(BackTick))
          break
    
        result += '`'
      }
    })

    if (literal)
      result = '`' + result.replaceAll('`', '``') + '`'
  
    return result
  }
  function parseBrackets(literal) {
    let result = ''
  
    lexer.eat(LeftBracket)
    
    lexer.toggleSkip(() => {
      while (true) {
        result += lexer.acceptNot(RightBracket)
    
        lexer.eat(RightBracket)
        
        if (!lexer.accept(RightBracket))
          break
    
        result += ']'
      }
    })

    if (literal)
      result = '[' + result.replaceAll(']', ']]') + ']'
  
    return result
  }
}