import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL) {
  console.error('❌ TURSO_DATABASE_URL is not set.');
  process.exit(1);
}

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'customer',
    loyalty_points INTEGER DEFAULT 0,
    vip_level TEXT DEFAULT 'standard',
    createdAt DATETIME DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items TEXT DEFAULT '[]',
    total REAL NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    address TEXT DEFAULT '',
    coupon_code TEXT DEFAULT '',
    discount REAL DEFAULT 0,
    createdAt DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    size TEXT DEFAULT 'Unique',
    quantity INTEGER DEFAULT 1,
    updatedAt DATETIME DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, product_id, size)
  )`,
  `DROP TABLE IF EXISTS products`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    file TEXT NOT NULL,
    cat TEXT NOT NULL,
    tags TEXT DEFAULT '',
    price REAL NOT NULL,
    priceStr TEXT NOT NULL,
    size TEXT DEFAULT 'Unique',
    categoryAttr TEXT NOT NULL,
    collection TEXT DEFAULT '',
    ribbon TEXT DEFAULT '',
    desc TEXT DEFAULT '',
    is_exclusive INTEGER DEFAULT 0,
    vip_min_level TEXT DEFAULT 'standard',
    createdAt DATETIME DEFAULT (datetime('now'))
  )`,
  `DROP TABLE IF EXISTS analytics`,
  `CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    product_id TEXT,
    user_id TEXT,
    data TEXT DEFAULT '{}',
    createdAt DATETIME DEFAULT (datetime('now'))
  )`,
];


async function init() {
  console.log('🚀 Initializing Database Schema...');
  for (const sql of SCHEMA) {
    try {
      await db.execute(sql);
      console.log(`✅ Executed: ${sql.split('\n')[0]}...`);
    } catch (err) {
      console.error(`❌ Error executing: ${sql.split('\n')[0]}`, err.message);
    }
  }
  console.log('✨ Database is ready.');
}

init().catch(console.error);
