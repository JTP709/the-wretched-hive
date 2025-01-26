const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./ecommerce.db', (err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to database');
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  }
});

process.on('exit', () => {
  db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Closed the database connection.');
    }
  });
});

/**
 * Products API
 * GET /api/products
 * GET /api/products/:id
 */

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  })
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    }
  });
});

/**
 * Cart API
 * GET /api/cart
 * POST /api/cart
 * DELETE /api/cart/:id
 * PUT /api/cart/:id
 */

app.get('/api/cart', (req, res) => {
  db.all('SELECT * FROM cart', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/cart', (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  db.exec('INSERT INTO cart (product_id, quantity) VALUES (?, ?)', [product_id, quantity], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ product_id, quantity });
    }
  });
});

app.delete('/api/cart/:id', (req, res) => {
  db.exec('DELETE FROM cart WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(204).json({ id: req.params.id });
    }
  });
});

app.put('/api/cart/:id', (req, res) => {
  const { quantity, id } = req.body;
  if (!quantity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  db.exec('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ id: req.params.id, quantity });
    }
  });
});

/**
 * Checkout API
 * POST /api/checkout
 */

app.post('/api/checkout', (req, res) => {
  const { name, email, address, phone, total } = req.body;
  if (!name || !email || !address || !phone || !total) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  db.exec(
    'INSERT INTO orders (name, email, address, phone, total) VALUES (?, ?, ?, ?, ?)',
    [name, email, address, phone, total],
  (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      db.get('SELECT last_insert_rowid() as id', (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(201).json({ id: row.id });
        }
      });
    }
  });
});
