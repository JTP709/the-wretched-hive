import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.resolve(__dirname, './orders.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV !== 'production' && console.log,
});

export default sequelize;
