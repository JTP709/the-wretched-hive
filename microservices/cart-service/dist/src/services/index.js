"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCartTotal = exports.updateCartItemQuantity = exports.removeProductFromCart = exports.addProductToCart = exports.getCartItems = exports.CartItemActionType = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
var CartItemActionType;
(function (CartItemActionType) {
    CartItemActionType["SUCCESS"] = "SUCCESS";
    CartItemActionType["NOT_FOUND"] = "NOT_FOUND";
    CartItemActionType["UPDATED"] = "UPDATED";
    CartItemActionType["DELETED"] = "DELETED";
    CartItemActionType["CREATED"] = "CREATED";
})(CartItemActionType || (exports.CartItemActionType = CartItemActionType = {}));
const getCartItems = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield models_1.Cart.findOne({
        where: {
            userId,
            status: CartStatus.ACTIVE,
        },
        include: [{
                model: models_1.CartItem,
                as: 'items',
            }]
    });
    return {
        type: CartItemActionType.SUCCESS,
        data: cart,
    };
});
exports.getCartItems = getCartItems;
const addProductToCart = (productId, userId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCartItem = yield models_1.CartItem.findOne({
        where: {
            productId,
            userId,
            orderId: {
                [sequelize_1.Op.is]: null,
            },
        },
    });
    if (existingCartItem) {
        existingCartItem.quantity += quantity;
        yield existingCartItem.save();
        return {
            type: CartItemActionType.UPDATED,
            data: existingCartItem
        };
    }
    const cartItem = yield models_1.CartItem.create({
        productId,
        userId,
        quantity,
    });
    return {
        type: CartItemActionType.CREATED,
        data: cartItem,
    };
});
exports.addProductToCart = addProductToCart;
const removeProductFromCart = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield models_1.CartItem.destroy({
        where: { id, userId },
    });
    if (deleted) {
        return {
            type: CartItemActionType.DELETED,
            message: `Cart item ${id} removed successfully`
        };
    }
    else {
        return {
            type: CartItemActionType.NOT_FOUND,
            message: `Cart item ${id} associated with user ${userId} was not found`,
        };
    }
});
exports.removeProductFromCart = removeProductFromCart;
const updateCartItemQuantity = (id, userId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    if (quantity <= 0) {
        // If the quantity is zero or negative, delete the cart item.
        return yield (0, exports.removeProductFromCart)(id, userId);
    }
    else {
        // Otherwise, update the quantity.
        const cartItem = yield models_1.CartItem.findByPk(id);
        if (!cartItem) {
            return {
                type: CartItemActionType.NOT_FOUND,
                message: `Cart item ${id} associated with user ${userId} was not found`,
            };
        }
        cartItem.quantity = quantity;
        yield cartItem.save();
        return {
            type: CartItemActionType.UPDATED,
            message: `Cart item ${id} quantity updated to ${quantity}`
        };
    }
});
exports.updateCartItemQuantity = updateCartItemQuantity;
const calculateCartTotal = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //   const result = await CartItem.findOne({
    //     attributes: [
    //       [
    //         // Calculate the total: SUM(cartItems.quantity * products.price)
    //         sequelize.fn(
    //           "SUM",
    //           sequelize.literal(`"CartItem"."quantity" * "Product"."price"`)
    //         ),
    //         "total"
    //       ]
    //     ],
    //     include: [
    //       {
    //         model: Product,
    //         as: "product",
    //         attributes: [] // no need to retrieve product fields
    //       }
    //     ],
    //     where: {
    //       userId: userId,
    //       orderId: {
    //         [Op.is]: null,
    //       }
    //     },
    //     raw: true
    //   });
    //   return {
    //     type: CartItemActionType.SUCCESS,
    //     data: result as unknown as { total: number } || 0,
    //   }
    return {
        type: CartItemActionType.SUCCESS,
        data: { total: 0 },
    };
});
exports.calculateCartTotal = calculateCartTotal;
