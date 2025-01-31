import sequelize from './dbInitialize';
import Product from './Product';
import CartItem from './CartItem';
import Order from './Order';

Product.hasOne(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(CartItem, { foreignKey: 'orderId' });
CartItem.belongsTo(Order, { foreignKey: 'orderId' });

export default sequelize;
export { Product, CartItem, Order };
