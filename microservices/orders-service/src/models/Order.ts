// models/Order.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "./dbInit";

class Order extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public streetAddress!: string;
  public streetAddressTwo?: string;
  public city!: string;
  public planet!: string;
  public postalCode!: string;
  public phone!: string;
  public cartId!: number;
  public userId!: string;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    streetAddress: { type: DataTypes.STRING, allowNull: false },
    streetAddressTwo: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    planet: { type: DataTypes.STRING, allowNull: false },
    postalCode: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
