import { Request, Response } from "express";
import { CartItem, Order } from "../model";
import { AuthRequest } from "../types/global";
import { handleErrors } from "../utils";
import { createOrder, getOrderTotal } from "../services";
import { CheckoutActionType } from "../services/checkout";

/**
 * GET /checkout/total
 * Retrieves the total checkout amount by calculating the sum of (quantity * price) 
 * across all cart items.
 */
export const get_checkout_total = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const orderId = req.params.id;
  try {
    const result = await getOrderTotal(orderId, userId);

    // If there are no cart items, result.total might be null.
    res.json({ total: result?.total || 0 });
  } catch (err) {
    handleErrors(res, err);
  }
};

/**
 * POST /checkout
 * Creates a new order with the provided customer and checkout details.
 */
export const post_checkout = async (req: Request, res: Response) => {
  const { name, email, address, phone, total } = req.body;
  const userId = (req as AuthRequest).userId;

  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('name');
  if (!address) missingFields.push('name');
  if (!phone) missingFields.push('name');
  if (total === undefined) missingFields.push('total');
  if (missingFields.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missingFields}` });
    return;
  }

  try {
    const { type, data, message } = await createOrder({ name, email, address, phone, total, userId });
    switch(type) {
      case CheckoutActionType.CREATED:
        res.status(201).json({ id: data?.id, message });
        return;
      case CheckoutActionType.NOT_FOUND:
        res.status(404).json(message);
        return;
      default:
        res.status(500).json({ message: "Internal server error" });
        return;
    }

  } catch (err) {
    handleErrors(res, err);
  }
};
