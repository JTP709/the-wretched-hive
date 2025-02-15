import client from "../grpc/productClient";
import sequelize, { Cart, CartItem, CartStatus } from "../models";
import { publishOrderMessage } from "../rabbitmq";
import {
  CartItemActionType,
  CartProduct,
  CartServiceResult,
  GetCartResult,
} from "./types";

const createNewCart = async (userId: string) => {
  return await Cart.create({
    userId,
    status: CartStatus.ACTIVE,
  });
};

const selectCartAndItems = async (userId: string) => {
  const cart = (await Cart.findOne({
    where: {
      userId,
      status: CartStatus.ACTIVE,
    },
    include: [
      {
        model: CartItem,
        as: "items",
      },
    ],
  })) as GetCartResult;

  if (!cart) {
    const newCart = await createNewCart(userId);
    return {
      ...newCart,
      items: [] as CartItem[],
    } as GetCartResult;
  }

  return cart;
};

const fetchProductInfo = async (cart: GetCartResult, userId: string) => {
  if (!cart?.items || cart.items.length === 0) return [];
  const items = cart.items;

  return new Promise<CartProduct[]>((resolve, reject) => {
    const productStream = client.GetProductsStream();

    const productIdToCartItem: Record<number, CartItem> = items.reduce(
      (record, item) => {
        const { productId } = item.dataValues;
        record[productId] = item;
        console.log({ productId }, typeof productId);
        productStream.write({ productId });

        return record;
      },
      {} as Record<number, CartItem>
    );

    const results: CartProduct[] = [];

    productStream.on("data", (response: any) => {
      const cartItem = productIdToCartItem[response.id];
      if (cartItem) {
        results.push({
          id: cartItem.id,
          quantity: cartItem.quantity,
          product: response,
        });
      }
    });

    productStream.on("error", (err: Error) => {
      console.error(`Stream error for user ${userId}:`, err);
      reject(err);
    });

    productStream.on("end", () => {
      resolve(results);
    });

    productStream.end();
  });
};

export const getCartItems = async (userId: string): CartServiceResult => {
  const cart = await selectCartAndItems(userId);
  const data = await fetchProductInfo(cart, userId);

  return {
    type: CartItemActionType.SUCCESS,
    data,
  };
};

export const addProductToCart = async (
  productId: string,
  userId: string
): CartServiceResult => {
  return await sequelize.transaction(async (transaction) => {
    let cart = await Cart.findOne({
      where: {
        userId,
        status: CartStatus.ACTIVE,
      },
      transaction,
    });

    if (!cart) {
      cart = await Cart.create(
        {
          userId,
          status: CartStatus.ACTIVE,
        },
        { transaction }
      );
    }

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { cardId: cart.id, productId, quantity: 1 },
      transaction,
    });

    if (!created) {
      await cartItem.increment("quantity", { by: 1, transaction });
      await cartItem.reload({ transaction });

      return {
        type: CartItemActionType.UPDATED,
        data: cartItem,
      };
    }

    return {
      type: CartItemActionType.CREATED,
      data: cartItem,
    };
  });
};

export const removeProductFromCart = async (
  id: number,
  userId: string
): CartServiceResult => {
  const cart = await selectCartAndItems(userId);

  const deleted = await CartItem.destroy({
    where: { id, cartId: cart.id },
  });

  if (deleted) {
    return {
      type: CartItemActionType.DELETED,
      message: `Cart item ${id} removed successfully`,
    };
  } else {
    return {
      type: CartItemActionType.NOT_FOUND,
      message: `Cart item ${id} associated with user ${userId} was not found`,
    };
  }
};

export const updateCartItemQuantity = async (
  id: number,
  userId: string,
  quantity: number
): CartServiceResult => {
  if (quantity <= 0) {
    // If the quantity is zero or negative, delete the cart item.
    return await removeProductFromCart(id, userId);
  } else {
    // Otherwise, update the quantity.
    const cartItem = await CartItem.findByPk(id);

    if (!cartItem) {
      return {
        type: CartItemActionType.NOT_FOUND,
        message: `Cart item ${id} associated with user ${userId} was not found`,
      };
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return {
      type: CartItemActionType.UPDATED,
      message: `Cart item ${id} quantity updated to ${quantity}`,
    };
  }
};

export const calculateCartTotal = async (userId: string) => {
  const cart = await selectCartAndItems(userId);
  const products = await fetchProductInfo(cart, userId);
  const total = products.reduce((accum, cartItem) => {
    const quantity = cartItem.quantity ?? 1;
    const price = cartItem.product.price;
    const cost = quantity * price;

    return accum + cost;
  }, 0);

  return {
    type: CartItemActionType.SUCCESS,
    data: total,
  };
};

export const checkoutCart = async (orderInfo: OrderInfo) => {
  const { userId } = orderInfo;
  const notFoundResponse = {
    type: CartItemActionType.NOT_FOUND,
    message: "No active cart was found with items to purchase",
  };
  const cart = await Cart.findOne({
    where: {
      userId,
      status: CartStatus.ACTIVE,
    },
    include: [
      {
        model: CartItem,
        as: "items",
      },
    ],
  });

  if (!cart) {
    await createNewCart(userId);

    return notFoundResponse;
  }

  if (!cart.dataValues.items.length) {
    return notFoundResponse;
  }

  cart.status = CartStatus.ORDERED;
  await cart.save();
  await createNewCart(userId);
  await publishOrderMessage({ ...orderInfo, cartId: cart.id });

  return {
    type: CartItemActionType.CREATED,
    message: "Checkout successful",
  };
};
