const { Pool } = require('pg')

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'scrumptious',
  password: '',
  post: 5432
})

if (isProduction) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: true
  })
}


module.exports = pool