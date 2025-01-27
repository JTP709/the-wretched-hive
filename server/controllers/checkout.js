const getCheckoutControllers = (db) => ({
  get_checkout_total: (_, res) => {
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
  },
  post_checkout: (req, res) => {
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
  },
});

module.exports = getCheckoutControllers;
