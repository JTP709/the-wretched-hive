import 'express-async-errors';
import 'dotenv/config';
import express from 'express';
import sequelize from './models';
import cartItemRoutes from './routes';
import { globalErrorHandler } from './middleware';

const PORT = process.env.PORT || 4001;

const app = express();

app.use(express.json());
app.use('/api/cart', cartItemRoutes);
app.use(globalErrorHandler);

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
        .catch((err: Error) => console.error('Error closing the database connection', err));
    });
  } catch (err) {
    console.error('An error occurred while starting the application', err);
  }
})()
