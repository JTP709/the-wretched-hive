import sequelize from "./dbInitialize";
import { DataTypes, Model } from "sequelize";
import Product from "./Product";
import Order from "./Order";

class CartItem extends Model {
  public id!: number;
  public productId!: number;
  public quantity!: number;
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
      unique: true,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Order,
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
