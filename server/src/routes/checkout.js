const express = require('express');
const getCheckoutControllers = require('../controllers/checkout');

const getCheckoutRoutes = (db) => {
  const {
    get_checkout_total,
    post_checkout,
  } = getCheckoutControllers(db);
  
  const router = express.Router();
  
  router.get('/total', get_checkout_total);
  router.post('/', post_checkout);

  return router;
}

module.exports = getCheckoutRoutes;
