import express from 'express';
import cors from 'cors';
import cartItemRoutes from './routes/cartItems';
import productsRoutes from './routes/products';
import checkoutRoutes from './routes/checkout';
import sequelize from './model';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartItemRoutes);
app.use('/api/checkout', checkoutRoutes);

(async function Main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    if(process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
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
