import express from 'express';
import {
  get_checkout_total,
  post_checkout,
} from '../controllers/checkout';

  
const router = express.Router();

router.get('/total', get_checkout_total);
router.post('/', post_checkout);


export default router;
