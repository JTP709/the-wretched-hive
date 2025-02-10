"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cart_1 = __importDefault(require("./Cart"));
const dbInit_1 = __importDefault(require("./dbInit"));
const sequelize_1 = require("sequelize");
class CartItem extends sequelize_1.Model {
}
CartItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    cartId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart_1.default,
            key: 'id',
        },
    },
}, {
    sequelize: dbInit_1.default,
    tableName: 'cartItems',
    timestamps: true,
});
exports.default = CartItem;
