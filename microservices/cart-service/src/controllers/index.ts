import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  addProductToCart,
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  checkoutCart,
} from "../services";

export const get_cart_items = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const userId = call.request.userId;
    const { type, data } = await getCartItems(userId);
    callback(null, { type, data, message: "" });
  } catch (err: any) {
    console.error(err);
    callback({ code: status.INTERNAL, message: "Internal server error" });
  }
};

export const add_cart_item = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId, productId } = call.request;
    const { type, data } = await addProductToCart(productId, userId);
    callback(null, { type, data });
  } catch (err: any) {
    console.error(err);
    callback({ code: status.INTERNAL, message: "Internal server error" });
  }
};

export const update_cart_item = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId, cartItemId, quantity } = call.request;
    const { type, message } = await updateCartItemQuantity(cartItemId, userId, quantity);
    callback(null, { type, message });
  } catch (err: any) {
    console.error(err);
    callback({ code: status.INTERNAL, message: "Internal server error" });
  }
};

export const remove_cart_item = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId, cartItemId } = call.request;
    const { type, message } = await removeProductFromCart(cartItemId, userId);
    callback(null, { type, message });
  } catch (err: any) {
    console.error(err);
    callback({ code: status.INTERNAL, message: "Internal server error" });
  }
};

export const get_cart_total = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId } = call.request;
    const { type, data } = await calculateCartTotal(userId);
    callback(null, { type, data, message: "" });
  } catch (err: any) {
    console.error(err);
    callback({ code: status.INTERNAL, message: "Internal server error" });
  }
};

export const checkout_cart = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const {
      name,
      email,
      streetAddress,
      streetAddressTwo,
      city,
      planet,
      postalCode,
      phone,
      total,
      userId,
    } = call.request;
    const { type, message } = await checkoutCart({
      name,
      email,
      streetAddress,
      streetAddressTwo,
      city,
      planet,
      postalCode,
      phone,
      total,
      userId,
    });
    callback(null, { type, message });
  } catch (err: any) {
    console.error(err);
    callback({ code: status.INTERNAL, message: "Internal server error" });
  }
};
