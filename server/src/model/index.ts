import sequelize from './dbInitialize';
import Product from './Product';
import CartItem from './CartItem';
import Order from './Order';
import User from './User';

Product.hasOne(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(CartItem, { foreignKey: 'orderId' });
CartItem.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

export default sequelize;
export { Product, CartItem, Order, User };
