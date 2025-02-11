import express from 'express';
import {
  get_products,
  get_product_by_id,
} from '../controllers';
  
const router = express.Router();

router.get('/:id', get_product_by_id);
router.get('/', get_products);

export default router;
