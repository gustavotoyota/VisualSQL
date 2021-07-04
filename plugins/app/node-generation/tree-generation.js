import Lexer from '../lexer.js'




// Tokens

const Skip = '\\s|--.*?[\n$]'

const Char = /./

const Backslash = /\\/

const LeftParenthesis = /\(/
const RightParenthesis = /\)/

const DoubleQuote = /"/
const SingleQuote = /'/
const BackTick = /`/

const LeftBracket = /\[/
const RightBracket = /\]/

const Word = /\w+/

const Comma = /,/
const Dot = /\./

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

const Inner = /\bINNER\b/
const Left = /\bLEFT\b/
const Right = /\bRIGHT\b/
const Full = /\bFULL\b/
const Cross = /\bCROSS\b/
const Outer = /\bOUTER\b/
const Join = /\bJOIN\b/

const Union = /\bUNION\b/
const All = /\bALL\b/
const Minus = /\bMINUS\b/
const Except = /\bEXCEPT\b/
const Intersect = /\bINTERSECT\b/

const NonWhitespace = /\S+/

const QueryStart = `(\\((${Skip})*)*\\bSELECT\\b`





global.parseSQL = parseSQL




function parseSQL(sql) {
  sql = `
  WITH
    test AS (
      SELECT
        *
      FROM
        asd
    ),
    "common2" AS (
      SELECT DISTINCT
        asd,
        sdf
      FROM
        hello
    )
  (
    SELECT -- hello!
    DISTINCT -- asdasd!!
    TOP 10.32123
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
  UNION ALL
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
  lexer.skip.pattern = Skip

  lexer.flags = 'i'
  
  lexer.reset(sql)
  



  return parseQuery()




  function parseQuery() {
    const result = {}

    result.commons = parseCommons()

    result.parts = []

    let part = {}

    while (true) {
      if (lexer.check(Select))
        part.select = parseSelect()
      else {
        lexer.eat(LeftParenthesis)
        part.query = parseQuery()
        lexer.eat(RightParenthesis)
      }

      result.parts.push(part)
      

      
      part = {}

      part.operation = lexer.accept(Union, Minus, Except, Intersect).toLowerCase()

      if (part.operation === 'union') {
        if (lexer.accept(All))
          part.operation = 'union-all'
      } else if (part.operation === 'minus' && part.operation === 'except') {
        part.operation = 'difference'
      } else if (part.operation === 'intersect') {
        part.operation = 'intersection'
      } else
        break
    }

    return result
  }


  

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
    } else
      lexer.accept(All)

    if (lexer.accept(Top)) {
      if (lexer.check(LeftParenthesis)) {
        lexer.eat(LeftParenthesis)
        result.limit = parseUntil(RightParenthesis)
        lexer.eat(RightParenthesis)
      } else
        result.limit = [lexer.eat(NonWhitespace)]
      
      result.limit.push(lexer.accept(Percent))
      result.limit.push(lexer.accept(WithTies))
    }
    
    result.select = parseUntil(From)

    


    // From

    lexer.eat(From)

    result.from = parseSources(Where, GroupBy,
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





  function parseSources(...endTokens) {
    const result = []

    let source = {}

    while (true) {
      if (lexer.check(LeftParenthesis)) {
        lexer.eat(LeftParenthesis)

        if (lexer.check(QueryStart))
          source.query = parseQuery()
        else
          source.sources = parseSources()

        lexer.eat(RightParenthesis)

        lexer.accept(As)

        source.alias = parseIdentifier()
      } else {
        source.table = parseIdentifier()

        if (lexer.accept(Dot)) {
          source.schema = source.table
          source.table = parseIdentifier()
        }

        lexer.accept(As)

        if (!lexer.check(On, Inner, Left, Right, Full, Cross, ...endTokens))
          source.alias = parseIdentifier()
      }

      if (source.operation && source.operation !== 'cross-join') {
        lexer.eat(On)

        source.condition = lexer.acceptNot(Inner, Left, Right, Full, Cross, ...endTokens)
      }

      result.push(source)



      source = {}

      source.operation = lexer.accept(Inner, Left, Right, Full, Cross, Comma).toLowerCase()

      if (!source.operation)
        break

      if (['left', 'right', 'full'].includes(source.operation))
        lexer.accept(Outer)

      lexer.eat(Join)

      if (source.operation === ',')
        source.operation = 'cross'
      
      source.operation += '-join'
    }

    return result
  }




  function parseUntil(...endTokens) {
    const result = []

    while (true) {
      result.push(lexer.acceptNot(LeftParenthesis, SingleQuote,
        DoubleQuote, BackTick, LeftBracket, ...endTokens))

      if (lexer.check(LeftParenthesis)) {
        result.push(lexer.eat(LeftParenthesis))

        if (lexer.check(QueryStart))
          result.push(parseQuery())
        else
          result.push(...parseUntil(RightParenthesis))

        result.push(lexer.eat(RightParenthesis))
      } else if (lexer.check(SingleQuote))
        result.push(parseSingleQuotes())
      else if (lexer.check(DoubleQuote))
        result.push(parseDoubleQuotes(true))
      else if (lexer.check(BackTick))
        result.push(parseBackTicks(true))
      else if (lexer.check(LeftBracket))
        result.push(parseBrackets(true))
      else
        break
    }

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
    
    return lexer.eat(Word)
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