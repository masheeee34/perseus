import { createClient } from '@libsql/client';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL) {
  console.warn('[Perseus DB] TURSO_DATABASE_URL not set — using local fallback');
}

const db = createClient({
  url: TURSO_URL || 'file:local.db',
  authToken: TURSO_TOKEN,
});

import { PerseusCatalog } from './catalog';

// Init tables only if using local fallback (Turso cloud already has schema)
const LOCAL_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'customer',
    preferences TEXT DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    vip_level TEXT DEFAULT 'standard',
    lang TEXT DEFAULT 'fr',
    is_banned INTEGER DEFAULT 0,
    last_ip TEXT DEFAULT '',
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
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
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
  `CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    PRIMARY KEY (user_id, product_id)
  )`,
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
  `CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL, -- 'view', 'click', 'add_to_cart'
    product_id TEXT,
    user_id TEXT,
    data TEXT DEFAULT '{}',
    createdAt DATETIME DEFAULT (datetime('now'))
  )`,
];

let initialized = false;
let initPromise: Promise<void> | null = null;

async function initDB(): Promise<void> {
  // Only init local DB — Turso cloud already has the schema
  const isLocal = !TURSO_URL || TURSO_URL.startsWith('file:');
  if (!isLocal) {
    console.log('[Perseus DB] Using Turso cloud ✓');
    return;
  }
  try {
    console.log('[Perseus DB] Initializing local DB…');
    await db.batch(LOCAL_SCHEMA);

    // Seed default config if missing
    await db.batch([
      { sql: "INSERT OR IGNORE INTO config (key, value) VALUES ('maintenance_mode', 'false')", args: [] },
      { sql: "INSERT OR IGNORE INTO config (key, value) VALUES ('site_name', 'PERSEUS')", args: [] },
      { sql: "INSERT OR IGNORE INTO config (key, value) VALUES ('contact_email', 'conciergerie@perseus-luxe.com')", args: [] },
    ]);

    // Seed products from PerseusCatalog if table is empty
    const prodCountRes = await db.execute('SELECT COUNT(*) as count FROM products');
    const count = Number(prodCountRes.rows[0]?.count || 0);
    if (count === 0 && PerseusCatalog && PerseusCatalog.length > 0) {
      console.log(`[Perseus DB] Seeding ${PerseusCatalog.length} catalog products into local DB…`);
      const seedStatements = PerseusCatalog.map((p) => ({
        sql: `INSERT OR IGNORE INTO products (id, name, file, cat, tags, price, priceStr, size, categoryAttr, collection, ribbon, desc, is_exclusive, vip_min_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          p.id,
          p.name,
          p.file,
          p.cat,
          p.tags || '',
          p.price,
          p.priceStr,
          p.size || 'Unique',
          p.categoryAttr,
          p.collection || '',
          p.ribbon || '',
          p.desc || '',
          p.is_exclusive ? 1 : 0,
          p.vip_min_level || 'standard',
        ],
      }));
      await db.batch(seedStatements);
      console.log('[Perseus DB] Products seeded successfully ✓');
    }

    console.log('[Perseus DB] Local DB ready ✓');
  } catch (error: any) {
    console.error('[Perseus DB] Init error:', error?.message || error);
    throw error;
  }
}

export async function getDB() {
  if (!initialized) {
    if (!initPromise) {
      initPromise = initDB()
        .then(() => { initialized = true; })
        .catch((err) => { initPromise = null; throw err; });
    }
    await initPromise;
  }
  return db;
}

export default db;
