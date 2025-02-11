import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  addProductToCart,
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
} from "../services";

export const getCartItemsRPC = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const userId = call.request.userId;
    const { type, data } = await getCartItems(userId);
    callback(null, { type, data, message: "" });
  } catch (err: any) {
    callback({ code: status.INTERNAL, message: err?.message });
  }
};

export const addCartItemRPC = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId, productId } = call.request;
    const { type, data } = await addProductToCart(productId, userId);
    callback(null, { type, data });
  } catch (err: any) {
    callback({ code: status.INTERNAL, message: err?.message });
  }
};

export const updateCartItemRPC = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId, cartItemId, quantity } = call.request;
    const { type, message } = await updateCartItemQuantity(cartItemId, userId, quantity);
    callback(null, { type, message });
  } catch (err: any) {
    callback({ code: status.INTERNAL, message: err?.message });
  }
};

export const removeCartItemRPC = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId, cartItemId } = call.request;
    const { type, message } = await removeProductFromCart(cartItemId, userId);
    callback(null, { type, message });
  } catch (err: any) {
    callback({ code: status.INTERNAL, message: err?.message });
  }
};

export const getCartTotalRPC = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  try {
    const { userId } = call.request;
    const { type, data } = await calculateCartTotal(userId);
    callback(null, { type, data, message: "" });
  } catch (err: any) {
    callback({ code: status.INTERNAL, message: err?.message });
  }
};
