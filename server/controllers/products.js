const getProductControllers = (db) => ({
  get_products: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    db.get('SELECT COUNT(*) AS total FROM products', (err, countResults) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        db.all(`
          SELECT * FROM products
          ORDER BY id
          LIMIT ? OFFSET ?;
        `, [limit, offset], (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            const total = countResults.total;
            const totalPages = Math.ceil(total / limit);
            res.json({
              page,
              limit,
              total,
              totalPages,
              data: rows,
            });
          }
        });
      }
    });
  },
  get_product_by_id: (req, res) => {
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
  },
});

module.exports = getProductControllers;
