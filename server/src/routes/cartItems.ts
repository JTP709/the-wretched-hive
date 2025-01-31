import express from 'express';
import getCartItemsControllers from '../controllers/cartItems';


const getCartItemsRoutes = (db: any) => {
  const {
    get_cart_items,
    post_cart_items,
    delete_cart_items,
    put_cart_items,
  } = getCartItemsControllers(db);
  const router = express.Router();
  
  router.get('/', get_cart_items);
  router.post('/', post_cart_items);
  router.put('/:id', put_cart_items);
  router.delete('/:id', delete_cart_items);

  return router;
};

export default getCartItemsRoutes;
