import sequelize from "./dbInitialize";
import { DataTypes, Model } from "sequelize";
import Product from "./Product";
import Order from "./Order";
import User from "./User";

class CartItem extends Model {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public orderId!: number;
  public userId!: number;
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
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
