import { Op } from "sequelize";
import sequelize, { CartItem, Product } from "../model";

export enum CartItemActionType {
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  CREATED = 'CREATED',
}

type CartServiceResult = Promise<{
  type: CartItemActionType,
  message?: string,
  data?: CartItem | CartItem[],
}>

export const getCartItems = async (userId: string): CartServiceResult => {
  const cartItems = await CartItem.findAll({
    include: [
      {
        model: Product,
        as: "product",
        required: true,
        attributes: ['name', 'price', 'image', 'category', 'description'],
      },
    ],
    where: {
      userId: userId,
      orderId: {
        [Op.is]: null,
      }
    }
  });

  return {
    type: CartItemActionType.SUCCESS,
    data: cartItems,
  }
};

export const addProductToCart = async (productId: string, userId: string, quantity: number): CartServiceResult => {
  const existingCartItem = await CartItem.findOne({
    where: {
      productId,
      userId,
      orderId: {
        [Op.is]: null,
      },
    },
  });

  if (existingCartItem) {
    existingCartItem.quantity += quantity;
    await existingCartItem.save();

    return {
      type: CartItemActionType.UPDATED,
      data: existingCartItem
    };
  }
  
  const cartItem = await CartItem.create({
    productId,
    userId,
    quantity,
  });

  return {
    type: CartItemActionType.CREATED,
    data: cartItem,
  }
};

export const removeProductFromCart = async (id: string, userId: string): CartServiceResult => {
  const deleted = await CartItem.destroy({
    where: { id, userId },
  });
  
  if (deleted) {
    return {
      type: CartItemActionType.DELETED,
      message: `Cart item ${id} removed successfully`
    };
  } else {
    return {
      type: CartItemActionType.NOT_FOUND,
      message: `Cart item ${id} associated with user ${userId} was not found`,
    };
  }
};

export const updateCartItemQuantity = async (id: string, userId: string, quantity: number): CartServiceResult => {
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
      message: `Cart item ${id} quantity updated to ${quantity}`
    };
  }
};

export const calculateCartTotal = async (userId: string) => {
  const result = await CartItem.findOne({
    attributes: [
      [
        // Calculate the total: SUM(cartItems.quantity * products.price)
        sequelize.fn(
          "SUM",
          sequelize.literal(`"CartItem"."quantity" * "Product"."price"`)
        ),
        "total"
      ]
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: [] // no need to retrieve product fields
      }
    ],
    where: {
      userId: userId,
      orderId: {
        [Op.is]: null,
      }
    },
    raw: true
  });

  return {
    type: CartItemActionType.SUCCESS,
    data: result as unknown as { total: number } || 0,
  }
};
