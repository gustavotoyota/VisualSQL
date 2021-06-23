
import oracle from './oracle/oracle.js'
import mySQL from './mysql/mysql.js'
import sqlServer from './sql-server/sql-server.js'
import postgres from './postgres/postgres.js'



export default {

  data: {
    'oracle': oracle,
    'mysql': mySQL,
    'sql-server': sqlServer,
    'postgres': postgres,
  },

  items: [
    { text: 'Oracle (≥ 12c)', value: 'oracle' },
    { text: 'MySQL', value: 'mysql' },
    { text: 'SQL Server (≥ 2012)', value: 'sql-server' },
    { text: 'PostgreSQL', value: 'postgres' },
  ],
  
}