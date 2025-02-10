"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get('/cart', controllers_1.get_cart_items);
router.post('/cart', controllers_1.post_cart_items);
router.delete('/cart/:id', controllers_1.delete_cart_items);
router.put('/cart/:id', controllers_1.put_cart_items);
router.get('/cart/total', controllers_1.get_cart_total);
// router.get('/health', get_health);
exports.default = router;
