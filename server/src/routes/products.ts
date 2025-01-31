import express from 'express';
import getProductControllers from '../controllers/products';

const getProductRoutes = (db: any) => {
  const {
    get_products,
    get_product_by_id,
  } = getProductControllers(db);
  
  const router = express.Router();
  
  router.get('/:id', get_product_by_id);
  router.get('/', get_products);

  return router;
}

export default getProductRoutes;