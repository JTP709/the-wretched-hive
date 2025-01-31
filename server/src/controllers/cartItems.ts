import { Request, Response } from "express";
import { Database } from "sqlite3";

const getCartItemsControllers = (db: Database) => ({
  get_cart_items: (_: Request, res: Response) => {
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
  },
  post_cart_items: (req: Request, res: Response) => {
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
  },
  delete_cart_items: (req: Request, res: Response) => {
    db.run('DELETE FROM cartItems WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(204).json({ id: req.params.id });
      }
    });
  },
  put_cart_items: (req: Request, res: Response) => {
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
      db.run('UPDATE cartItems SET quantity = ? WHERE id = ?;', [quantity, id], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json({ id: req.params.id, quantity });
        }
      });
    }
  },
});

export default getCartItemsControllers;
