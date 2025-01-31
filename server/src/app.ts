import express from 'express';
import cors from 'cors';
import getCartItemRoutes from './routes/cartItems';
import getProductsRoutes from './routes/products';
import getCheckoutRoutes from './routes/checkout';
import connectToDatabase from './model/index';

const app = express();

app.use(cors());
app.use(express.json());

const db = connectToDatabase(app);

app.use('/api/products', getProductsRoutes(db));
app.use('/api/cart', getCartItemRoutes(db));
app.use('/api/checkout', getCheckoutRoutes(db));
