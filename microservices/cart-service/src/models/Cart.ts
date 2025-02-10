import sequelize from "./dbInit";
import { DataTypes, Model } from "sequelize";

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  ORDERED = 'ORDERED',
  ABANDONED = 'ABANDONED',
}

class Cart extends Model {
  public id!: number;
  public userId!: number;
  public status!: CartStatus;
}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: CartStatus.ACTIVE,
  }
}, {
  sequelize,
  tableName: 'cart',
  timestamps: true,
});

export default Cart;
