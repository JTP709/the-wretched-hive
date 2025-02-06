import express from 'express';
import {
  get_cart_items,
  post_cart_items,
  delete_cart_items,
  put_cart_items,
  get_cart_total,
} from '../controllers/cartItems';
import { csrfProtection } from '../middleware/csrf';

const router = express.Router();

router.get('/', get_cart_items);
router.post('/', csrfProtection, post_cart_items);
router.put('/:id', csrfProtection, put_cart_items);
router.delete('/:id', csrfProtection, delete_cart_items);
router.get('/total', get_cart_total);

export default router;
