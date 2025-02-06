import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cartItemRoutes from './routes/cartItems';
import productsRoutes from './routes/products';
import checkoutRoutes from './routes/checkout';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import sequelize from './model';
import authentication from './middleware/authentication';
import cookieParser from 'cookie-parser';


const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api', authentication);
app.use('/api/cart', cartItemRoutes);
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
