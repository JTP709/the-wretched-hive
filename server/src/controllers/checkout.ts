import { Request, Response } from "express";
import { CartItem, Order } from "../model";
import { AuthRequest } from "../types/global";

/**
 * GET /checkout/total
 * Retrieves the total checkout amount by calculating the sum of (quantity * price) 
 * across all cart items.
 */
export const get_checkout_total = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const orderId = req.params.id;
  try {
    const result = await Order.findOne({
      attributes: ['total'],
      where: {
        id: orderId,
        userId: userId,
      },
    });

    // asserting the type since this query does not return a CartItem
    const totalResult = result as unknown as { total: number } || null;

    // If there are no cart items, result.total might be null.
    res.json({ total: totalResult?.total || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /checkout
 * Creates a new order with the provided customer and checkout details.
 */
export const post_checkout = async (req: Request, res: Response) => {
  const { name, email, address, phone, total } = req.body;
  const userId = (req as AuthRequest).userId;

  if (!name || !email || !address || !phone || total === undefined) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('name');
    if (!address) missingFields.push('name');
    if (!phone) missingFields.push('name');
    if (total === undefined) missingFields.push('total');

    res.status(400).json({ error: `Missing required fields: ${missingFields}` });
    return;
  }

  try {
    const cartItems = await CartItem.findAll({ where: { userId }});

    if (cartItems.length === 0) {
      res.status(400).json({ error: "No items in cart to checkout" });
      return;
    }

    const order = await Order.create({ name, email, address, phone, total, userId });

    await Promise.all(
      cartItems.map(cartItem => cartItem.update({ orderId: order.id }))
    )

    res.status(201).json({ id: order.id, message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
