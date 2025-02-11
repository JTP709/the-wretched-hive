import sequelize from "./dbInitialize";
import { DataTypes, Model } from "sequelize";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public image!: string;
  public category!: string;
  public description!: string;
};

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false,
  },
);

export default Product;
