import sequelize from './dbInitialize';
import Product from './Product';
import CartItem from './CartItem';
import Order from './Order';
import User from './User';

CartItem.belongsTo(Product, { foreignKey: 'productId', as: "product" });
Product.hasOne(CartItem, { foreignKey: 'productId', as: "cartItems" });

Order.hasMany(CartItem, { foreignKey: 'orderId' });
CartItem.belongsTo(Order, { foreignKey: 'orderId' });

User.hasOne(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });


export default sequelize;
export { Product, CartItem, Order, User };
