const express = require('express');
const cors = require('cors');
const getCartItemRoutes = require('./routes/cartItems');
const getProductsRoutes = require('./routes/products');
const getCheckoutRoutes = require('./routes/checkout');
const connectToDatabase = require('./model');

const app = express();

app.use(cors());
app.use(express.json());

const db = connectToDatabase(app);

app.use('/api/products', getProductsRoutes(db));
app.use('/api/cart', getCartItemRoutes(db));
app.use('/api/checkout', getCheckoutRoutes(db));
