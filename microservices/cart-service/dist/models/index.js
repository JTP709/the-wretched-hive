"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = exports.Cart = void 0;
const dbInit_1 = __importDefault(require("./dbInit"));
const Cart_1 = __importDefault(require("./Cart"));
exports.Cart = Cart_1.default;
const CartItem_1 = __importDefault(require("./CartItem"));
exports.CartItem = CartItem_1.default;
Cart_1.default.hasMany(CartItem_1.default, { foreignKey: 'cartId', as: 'items' });
CartItem_1.default.belongsTo(Cart_1.default, { foreignKey: 'cartId', as: 'cart' });
exports.default = dbInit_1.default;
