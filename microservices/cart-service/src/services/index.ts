import { Op } from "sequelize";
import sequelize, { Cart, CartItem, CartStatus } from "../models";

export enum CartItemActionType {
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  CREATED = 'CREATED',
}

interface GetCartResult extends Cart {
  items: CartItem[]
}

type CartServiceResult = Promise<{
  type: CartItemActionType,
  message?: string,
  data?: any //Cart | CartItem | null,
}>

export const getCartItems = async (userId: string): CartServiceResult => {
  const cart = await Cart.findOne({
    where: {
      userId,
      status: CartStatus.ACTIVE,
    },
    include: [{
      model: CartItem,
      as: 'items',
    }]
  }) as GetCartResult;

  if (!cart) {
    await Cart.create({ userId });
  }

  if (cart?.items) {
    const products = await Promise.all(
      cart.items.map(async (item) => {
        const result = await fetch(`http://localhost:4000/api/products/${item.productId}`);
        if (!result.ok) {
          console.log(
            `Could not fetch product details for ${item.productId}`,
            { userId, result, cartId: cart.dataValues.id }
          );
          return {}
        }

        const product = await result.json();

        return {
          id: item.id,
          quantity: item.quantity,
          product,
        };
      })
    );

    const data = products.filter(product => Object.keys(product).length > 0);

    return {
      type: CartItemActionType.SUCCESS,
      data,
    }
  }

  return {
    type: CartItemActionType.SUCCESS,
    data: [],
  }

};

export const addProductToCart = async (productId: string, userId: string): CartServiceResult => {
  // Find the active cart
  // check if item exists in the cart
  // -- if item exists, increment quantity by 1
  // -- else create a new cart item

  return await sequelize.transaction(async (transaction) => {
    let cart = await Cart.findOne({
      where: {
        userId,
        status: CartStatus.ACTIVE,
      },
      transaction,
    });
  
    if (!cart) {
      cart = await Cart.create({
        userId,
      }, { transaction });
    }
  
    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { cardId: cart.id, productId, quantity: 1 },
      transaction,
    });
  
    if (!created) {
      await cartItem.increment('quantity', { by: 1, transaction });
      await cartItem.reload({ transaction });
  
      return {
        type: CartItemActionType.UPDATED,
        data: cartItem
      };
    }
  
    return {
      type: CartItemActionType.CREATED,
      data: cartItem,
    }
  });
};

export const removeProductFromCart = async (id: string, userId: string): CartServiceResult => {
  let cart = await Cart.findOne({
    where: {
      userId,
      status: CartStatus.ACTIVE
    }
  });

  if (!cart) {
    cart = await Cart.create({ userId });
  }

  const deleted = await CartItem.destroy({
    where: { id, cartId: cart.id },
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
}
};
