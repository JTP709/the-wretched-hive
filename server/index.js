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
  db.all(`
    SELECT c.id, productId, quantity, name, price, image, category, description 
    FROM cartItems AS c 
    LEFT JOIN products AS p
    WHERE c.productId = p.id;
  `, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  db.run(`
    INSERT INTO cartItems (productId, quantity)
    VALUES(?, ?)
    ON CONFLICT(productId)
    DO UPDATE SET quantity = quantity + excluded.quantity;
  `, [productId, quantity], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ productId, quantity });
    }
  });
});

app.delete('/api/cart/:id', (req, res) => {
  db.run('DELETE FROM cartItems WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(204).json({ id: req.params.id });
    }
  });
});

app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  if (quantity === undefined || quantity === null) {
    res.status(400).json({ error: 'Missing required fields' });
  } else if (quantity <= 0) {
    db.run('DELETE FROM cartItems WHERE id = ?', [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(204).json({ id: req.params.id });
      }
    })
  } else {
    db.run('UPDATE cartItems SET quantity = ? WHERE id = ?;', [quantity, id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ id: req.params.id, quantity });
      }
    });
  }
});

/**
 * Checkout API
 * POST /api/checkout
 */

app.get('/api/checkout/total', (_, res) => {
  db.get(`
    SELECT SUM(cartItems.quantity * products.price) AS total
    FROM cartItems
    JOIN products ON cartItems.productId = products.id;
  `, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/checkout', (req, res) => {
  console.log(req.body)
  const { name, email, address, phone, total } = req.body;
  if (!name || !email || !address || !phone || !total) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  db.run(
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
