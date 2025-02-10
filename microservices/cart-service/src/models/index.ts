import sequelize from "./dbInit";
import Cart, { CartStatus } from "./Cart";
import CartItem from "./CartItem";

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

export default sequelize;
export { Cart, CartItem, CartStatus };
