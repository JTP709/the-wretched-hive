import { CartItem, Order } from "../model";

export enum CheckoutActionType {
  SUCCESS = 'SUCCESS',
  CREATED = 'CREATED',
  NOT_FOUND = 'NOT_FOUND',
}

type CheckoutServiceResult = Promise<{
  type: CheckoutActionType,
  message?: string,
  data?: Order | { total: number },
}>

export const getOrderTotal = async (orderId: string, userId: string): CheckoutServiceResult => {
  const result = await Order.findOne({
    attributes: ['total'],
    where: {
      id: orderId,
      userId: userId,
    },
  }) as unknown as { total: number } ;

  // asserting the type since this query does not return a CartItem
  return {
    type: CheckoutActionType.SUCCESS,
    data: result || { total: 0 }
  };
};

interface OrderDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
  total: string;
  userId: string;
}

export const createOrder = async (orderDetails: OrderDetails): CheckoutServiceResult => {
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
