
//import oracle from './oracle/oracle.js'
//import mySQL from './mysql/mysql.js'
//import msSQLServer from './ms-sql-server/ms-sql-server.js'
import postgres from './postgres/postgres.js'



export default {

  data: {
    //'oracle': oracle,
    //'mysql': mySQL,
    //'ms-sql-server': msSQLServer,
    'postgres': postgres,
  },

  items: [
    //{ text: 'Oracle', value: 'oracle' },
    //{ text: 'MySQL', value: 'mysql' },
    //{ text: 'MS SQL Server', value: 'ms-sql-server' },
    { text: 'PostgreSQL', value: 'postgres' },
  ],
  
}