import 'dotenv/config';
import { Client } from 'pg';

async function createDatabaseIfMissing() {
  const dbName = process.env.DB_DATABASE as string;
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  await client.connect();
  try {
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database ${dbName} not found. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } finally {
    await client.end();
  }
}

createDatabaseIfMissing().catch((err) => {
  console.error('Failed to ensure database exists', err);
  process.exit(1);
});