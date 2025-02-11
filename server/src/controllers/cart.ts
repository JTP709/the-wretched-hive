import { Request, Response } from "express";
import { AuthRequest } from "../types/global";
import { addCartItem, getCartItems, getCartTotal, removeCartItem, updateCartItem } from "../grpc/cartClient";
import { CartItemActionType } from "../types/enums";

/**
 * GET /cart-items
 * Retrieves all cart items along with associated product details.
 */
export const get_cart_items = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { data } = await getCartItems(userId);

  // There is only one return action type: SUCCESS
  res.status(200).json(data);
};

/**
 * POST /cart-items
 * Creates a new cart item or increments the quantity of an existing cart item.
 */
export const post_cart_items = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = (req as AuthRequest).userId;
  if (!productId) {
    res.status(400).json({ error: 'Missing required fields: productId' });
    return;
  }
  
  const { type, data } = await addCartItem(userId, productId);
  switch(type) {
    case CartItemActionType.CREATED:
      res.status(201).json({ productId });
      return;
    case CartItemActionType.UPDATED:
      res.status(200).json({ productId, quantity: data.quantity})
      return;
    default:
      res.status(500).json({ message: "Internal server error" });
      return;
  }
};

/**
 * DELETE /cart-items/:id
 * Deletes a cart item by its id.
 */
export const delete_cart_items = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).userId;

  const { type, message } = await removeCartItem(userId, parseInt(id, 10));
  switch(type) {
    case CartItemActionType.DELETED:
      res.status(204).json({ message });
      return;
    case CartItemActionType.NOT_FOUND:
      res.status(404).json({ message });
      return;
    default:
      res.status(500).json({ message: "Internal server error" });
      return;
  }
};

/**
 * PUT /cart-items/:id
 * Updates the quantity of a cart item by its id.
 * If the new quantity is <= 0, the cart item is deleted.
 */
export const put_cart_items = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = (req as AuthRequest).userId;

  if (quantity == null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const { type, message } = await updateCartItem(userId, parseInt(id, 10), quantity);
  switch(type) {
    case CartItemActionType.DELETED:
      res.status(204).json({ message });
      return;
    case CartItemActionType.UPDATED:
      res.status(200).json({ message });
      return;
    case CartItemActionType.NOT_FOUND:
      res.status(404).json({ message });
      return;
    default:
      res.status(500).json({ message: "Internal server error" });
      return;
  }
};

/**
 * GET /cart/total
 * Retrieves the total cart amount by calculating the sum of (quantity * price) 
 * across all cart items.
 */
export const get_cart_total = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { data } = await getCartTotal(userId);

  res.json(data);
};
