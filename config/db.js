import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
let pool;

function init() {
  if (pool) {
    return pool;
  }

  if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });
  } else {
    pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    });
  }

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  return pool;
}

pool = init();

export function query(text, params) {
  return pool.query(text, params);
}

export default pool;
