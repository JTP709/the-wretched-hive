import 'dotenv/config';
import express, { Request } from 'express';
import cors from 'cors';
// import cartItemRoutes from './routes/cartItems';
import productsRoutes from './routes/products';
import checkoutRoutes from './routes/checkout';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import healthRoutes from './routes/health';
import sequelize from './model';
import authentication from './middleware/authentication';
import cookieParser from 'cookie-parser';
import { csrfProtection } from './middleware/csrf';
import { createProxyMiddleware, errorResponsePlugin, loggerPlugin, proxyEventsPlugin } from 'http-proxy-middleware';
import { AuthRequest } from './types/global';

const PORT = process.env.PORT || 4000;
const CART_SERVICE_URL = 'http://127.0.0.1:4001/api/cart';

const cartServiceProxy = createProxyMiddleware({
  target: CART_SERVICE_URL,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      const request = req as AuthRequest;
      if (request.userId) {
        proxyReq.setHeader('x-user-id', request.userId.toString())
      }
    },
    error: (err, req, res, target) => {
      console.log('>>> Proxy error: ', { err, req, res, target })
    }
  },
  plugins: [proxyEventsPlugin, errorResponsePlugin, loggerPlugin]
});

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use('/api/cart', authentication, cartServiceProxy);
app.use(express.json());
app.use(csrfProtection);
app.use('/api/health', healthRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use(authentication);
// app.use('/api/cart', cartItemRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', usersRoutes);

(async function Main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    if(process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      // await sequelize.sync({ alter: true });
      // use if error occurs WARNING: this will delete all data
      // await sequelize.sync({ force: true })
      console.log('All models were synchronized successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on('exit', () => {
      sequelize.close()
        .then(() => console.log('Closed the database connection successfully'))
        .catch((err) => console.error('Error closing the database connection', err));
    });
  } catch (err) {
    console.error('An error occurred while starting the application', err);
  }
})()
