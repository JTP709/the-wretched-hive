const express = require('express');
const getProductControllers = require('../controllers/products');

const getProductRoutes = (db) => {
  const {
    get_products,
    get_product_by_id,
  } = getProductControllers(db);
  
  const router = express.Router();
  
  router.get('/:id', get_product_by_id);
  router.get('/', get_products);

  return router;
}

module.exports = getProductRoutes;