import express from 'express';
import {
  get_checkout_total,
  post_checkout,
} from '../controllers/checkout';
import { csrfProtection } from '../middleware/csrf';

  
const router = express.Router();

router.get('/total/:id', get_checkout_total);
router.post('/', csrfProtection, post_checkout);


export default router;
