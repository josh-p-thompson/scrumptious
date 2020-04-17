const { Pool } = require('pg')

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'scrumptious',
//   password: '',
//   post: 5432
// })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

module.exports = { pool }


// module.exports = pool