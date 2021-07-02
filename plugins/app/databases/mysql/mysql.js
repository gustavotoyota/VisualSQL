import generateTree from './tree-generation.js'
import generateSQL from './sql-generation.js'

export default {
  generateTree: generateTree,
  generateSQL: generateSQL,
  
  
  
  
  infos: {
    
    disabledNodeTypes: [
      'difference',
      'intersection',
      'full-join',
    ],

  },




  processIdentifier(identifier) {
    if (/\s/.test(identifier))
      return '`' + identifier.replaceAll('`', '``') + '`'
    else
      return identifier
  },
}