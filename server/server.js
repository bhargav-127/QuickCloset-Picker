const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

// Helper: parse tags stored as JSON string
function parseTags(row) {
  if (!row) return row;
  try {
    row.tags = row.tags ? JSON.parse(row.tags) : [];
  } catch (e) {
    row.tags = [];
  }
  return row;
}

// GET /tables/wardrobe_items
app.get('/tables/wardrobe_items', (req, res) => {
  db.all('SELECT * FROM wardrobe_items ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows = rows.map(r => parseTags(r));
    res.json({ data: rows, total: rows.length, page: 1, limit: rows.length });
  });
});

// GET /tables/wardrobe_items/:id
app.get('/tables/wardrobe_items/:id', (req, res) => {
  db.get('SELECT * FROM wardrobe_items WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(parseTags(row));
  });
});

// POST /tables/wardrobe_items
app.post('/tables/wardrobe_items', (req, res) => {
  const id = uuidv4();
  const { title, category, image_url, tags } = req.body;
  const now = Date.now();
  const tagsStr = JSON.stringify(Array.isArray(tags) ? tags : []);
  db.run(
    `INSERT INTO wardrobe_items (id, title, category, image_url, tags, created_at, updated_at) VALUES (?,?,?,?,?,?,?)`,
    [id, title, category, image_url, tagsStr, now, now],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM wardrobe_items WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(parseTags(row));
      });
    }
  );
});

// PUT /tables/wardrobe_items/:id
app.put('/tables/wardrobe_items/:id', (req, res) => {
  const id = req.params.id;
  const { title, category, image_url, tags } = req.body;
  const now = Date.now();
  const tagsStr = JSON.stringify(Array.isArray(tags) ? tags : []);
  db.run(
    `UPDATE wardrobe_items SET title=?, category=?, image_url=?, tags=?, updated_at=? WHERE id=?`,
    [title, category, image_url, tagsStr, now, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM wardrobe_items WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(parseTags(row));
      });
    }
  );
});

// DELETE /tables/wardrobe_items/:id
app.delete('/tables/wardrobe_items/:id', (req, res) => {
  db.run('DELETE FROM wardrobe_items WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Saved outfits endpoints
app.get('/tables/saved_outfits', (req, res) => {
  db.all('SELECT * FROM saved_outfits ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows, total: rows.length, page: 1, limit: rows.length });
  });
});

app.get('/tables/saved_outfits/:id', (req, res) => {
  db.get('SELECT * FROM saved_outfits WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

app.post('/tables/saved_outfits', (req, res) => {
  const id = uuidv4();
  const { outfit_name, shirt_id, pants_id, accessories_id, shoes_id, notes } = req.body;
  const now = Date.now();
  db.run(
    `INSERT INTO saved_outfits (id, outfit_name, shirt_id, pants_id, accessories_id, shoes_id, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, outfit_name, shirt_id, pants_id, accessories_id, shoes_id, notes, now, now],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM saved_outfits WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      });
    }
  );
});

app.delete('/tables/saved_outfits/:id', (req, res) => {
  db.run('DELETE FROM saved_outfits WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`QuickCloset API listening on http://localhost:${PORT}`);
});
