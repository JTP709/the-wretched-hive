import express from 'express';
import getCheckoutControllers from '../controllers/checkout';

const getCheckoutRoutes = (db: any) => {
  const {
    get_checkout_total,
    post_checkout,
  } = getCheckoutControllers(db);
  
  const router = express.Router();
  
  router.get('/total', get_checkout_total);
  router.post('/', post_checkout);

  return router;
}

export default getCheckoutRoutes;
