import { CartItem, Order } from "../model";

export enum CheckoutActionType {
  CREATED = 'CREATED',
  NOT_FOUND = 'NOT_FOUND',
}

export const getOrderTotal = async (orderId: string, userId: string) => {
  const result = await Order.findOne({
    attributes: ['total'],
    where: {
      id: orderId,
      userId: userId,
    },
  });

  // asserting the type since this query does not return a CartItem
  return result as unknown as { total: number } || 0;
};

interface OrderDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
  total: string;
  userId: string;
}

export const createOrder = async (orderDetails: OrderDetails) => {
  const { userId } = orderDetails;
  const cartItems = await CartItem.findAll({ where: { userId }});

  if (cartItems.length === 0) {
    return {
      type: CheckoutActionType.NOT_FOUND,
      message: "No items were found in the user's cart",
    }
  }

  const order = await Order.create({ ...orderDetails });

  await Promise.all(
    cartItems.map(cartItem => cartItem.update({ orderId: order.id }))
  )

  return {
    type: CheckoutActionType.CREATED,
    data: order,
    message: "Order placed successfully",
  };
};
