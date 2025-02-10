import Cart from "./Cart";
import sequelize from "./dbInit";
import { DataTypes, Model } from "sequelize";

class CartItem extends Model {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public cartId!: number;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'cartItems',
    timestamps: true,
  },
);

export default CartItem;
