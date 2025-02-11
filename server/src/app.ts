import 'express-async-errors';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import checkoutRoutes from './routes/checkout';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import healthRoutes from './routes/health';
import authentication from './middleware/authentication';
import csrfProtection from './middleware/csrf';
import errorHandler from './middleware/httpErrorHandler';
import sequelize from './model';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use(csrfProtection);
app.use('/api/auth', authRoutes);
app.use(authentication);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', usersRoutes);
app.use(errorHandler);

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
