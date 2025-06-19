import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://babyfoot_user:babyfoot_password@localhost:5432/babyfoot',
  ssl: process.env.NODE_ENV === 'production' ? false : false,
})

export default pool