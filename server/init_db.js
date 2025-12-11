const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data.db');

if (fs.existsSync(DB_PATH)) {
  console.log('Database already exists at', DB_PATH);
  process.exit(0);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error(err.message);
  console.log('Created database:', DB_PATH);
});

db.serialize(() => {
  db.run(`CREATE TABLE wardrobe_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    tags TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`);

  db.run(`CREATE TABLE saved_outfits (
    id TEXT PRIMARY KEY,
    outfit_name TEXT,
    shirt_id TEXT,
    pants_id TEXT,
    accessories_id TEXT,
    shoes_id TEXT,
    notes TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`);

  console.log('Tables created: wardrobe_items, saved_outfits');
});

db.close((err) => {
  if (err) return console.error(err.message);
  console.log('Database initialization complete.');
});
