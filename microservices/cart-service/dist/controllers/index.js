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
exports.get_cart_total = exports.put_cart_items = exports.delete_cart_items = exports.post_cart_items = exports.get_cart_items = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const services_2 = require("../services");
/**
 * GET /cart-items
 * Retrieves all cart items along with associated product details.
 */
const get_cart_items = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { data } = yield (0, services_1.getCartItems)(userId);
        res.json(data);
    }
    catch (err) {
        (0, utils_1.handleErrors)(res, err);
    }
});
exports.get_cart_items = get_cart_items;
/**
 * POST /cart-items
 * Creates a new cart item or increments the quantity of an existing cart item.
 */
const post_cart_items = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    if (!productId || !quantity) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const result = yield (0, services_1.addProductToCart)(productId, userId, quantity);
        const cartItem = result.data;
        switch (result.type) {
            case services_2.CartItemActionType.CREATED:
                res.status(201).json({ productId, quantity });
                return;
            case services_2.CartItemActionType.UPDATED:
                res.status(200).json({ productId, quantity: cartItem.quantity });
                return;
            default:
                res.status(500).json({ message: "Internal server error" });
                return;
        }
    }
    catch (err) {
        (0, utils_1.handleErrors)(res, err);
    }
});
exports.post_cart_items = post_cart_items;
/**
 * DELETE /cart-items/:id
 * Deletes a cart item by its id.
 */
const delete_cart_items = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const { type, message } = yield (0, services_1.removeProductFromCart)(id, userId);
        switch (type) {
            case services_2.CartItemActionType.DELETED:
                res.status(204).json({ message });
                return;
            case services_2.CartItemActionType.NOT_FOUND:
                res.status(404).json({ message });
                return;
            default:
                res.status(500).json({ message: "Internal server error" });
                return;
        }
    }
    catch (err) {
        (0, utils_1.handleErrors)(res, err);
    }
});
exports.delete_cart_items = delete_cart_items;
/**
 * PUT /cart-items/:id
 * Updates the quantity of a cart item by its id.
 * If the new quantity is <= 0, the cart item is deleted.
 */
const put_cart_items = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;
    if (quantity == null) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const { type, message } = yield (0, services_1.updateCartItemQuantity)(id, userId, quantity);
        switch (type) {
            case services_2.CartItemActionType.DELETED:
                res.status(204).json({ message });
                return;
            case services_2.CartItemActionType.UPDATED:
                res.status(200).json({ message });
                return;
            case services_2.CartItemActionType.NOT_FOUND:
                res.status(404).json({ message });
                return;
            default:
                res.status(500).json({ message: "Internal server error" });
                return;
        }
    }
    catch (err) {
        (0, utils_1.handleErrors)(res, err);
    }
});
exports.put_cart_items = put_cart_items;
/**
 * GET /cart/total
 * Retrieves the total cart amount by calculating the sum of (quantity * price)
 * across all cart items.
 */
const get_cart_total = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield (0, services_2.calculateCartTotal)(req.userId);
        // If there are no cart items, result.total might be null.
        res.json({ total: data === null || data === void 0 ? void 0 : data.total });
    }
    catch (err) {
        (0, utils_1.handleErrors)(res, err);
    }
});
exports.get_cart_total = get_cart_total;
