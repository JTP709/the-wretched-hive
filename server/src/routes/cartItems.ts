import express from 'express';
import {
  get_cart_items,
  post_cart_items,
  delete_cart_items,
  put_cart_items,
  get_cart_total,
} from '../controllers/cartItems';

const router = express.Router();

router.get('/', get_cart_items);
router.post('/', post_cart_items);
router.put('/:id', put_cart_items);
router.delete('/:id', delete_cart_items);
router.get('/total', get_cart_total);

export default router;
