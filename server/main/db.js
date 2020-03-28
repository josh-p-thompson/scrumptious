const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'scrumptious',
  password: '',
  post: 5432
})

module.exports = pool