import client from "../grpc/productClient";
import sequelize, { Cart, CartItem, CartStatus } from "../models";
import { CartItemActionType, CartProduct, CartServiceResult, GetCartResult, Product } from "./types";

const selectCartAndItems = async (userId: string) => {
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
    return await Cart.create({ userId }) as GetCartResult;
  }

  return cart;
};

const fetchProductInfo = async (cart: GetCartResult, userId: string) => {
  if (!cart?.items) return [];

  const productDetails = await Promise.all(
    cart.items.map(item => {
      return new Promise<CartProduct>((resolve) => {
        const productId = item.dataValues.productId;
        client.GetProduct({ productId }, (err: Error, response: any) => {
          if (err) {
            console.error(
              `Could not fetch product details for ${productId}`,
              { userId, err, cartId: cart.dataValues.id },
            );
            return resolve({} as CartProduct)
          }

          resolve({
            id: item.id,
            quantity: item.quantity,
            product: response
          } as CartProduct)
        })
      })
    })
  );

  return productDetails.filter(product => Object.keys(product).length > 0);
};

export const getCartItems = async (userId: string): CartServiceResult => {
  const cart = await selectCartAndItems(userId);
  const data = await fetchProductInfo(cart, userId);    

  return {
    type: CartItemActionType.SUCCESS,
    data,
  }
};

export const addProductToCart = async (productId: string, userId: string): CartServiceResult => {
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
  const cart = await selectCartAndItems(userId);

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
    data: { total },
  }
};
