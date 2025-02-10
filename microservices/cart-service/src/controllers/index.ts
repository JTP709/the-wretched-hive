import { Request, Response } from "express";
import { CartItem } from "../models";
import { addProductToCart, getCartItems, removeProductFromCart, updateCartItemQuantity } from "../services";
import { calculateCartTotal } from "../services";
import { CartItemActionType } from "../services/types";

/**
 * GET /cart-items
 * Retrieves all cart items along with associated product details.
 */
export const get_cart_items = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const { data } = await getCartItems(userId);
  
  res.json(data);
};

/**
 * POST /cart-items
 * Creates a new cart item or increments the quantity of an existing cart item.
 */
export const post_cart_items = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.headers['x-user-id'] as string;

  const missingFields = [];
  if (!productId) missingFields.push('productId');
  if (!userId) missingFields.push('userId');
  if (missingFields.length) {
    res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    return;
  }
  
  const result = await addProductToCart(productId, userId);
  const cartItem = result.data as CartItem;
  
  switch(result.type) {
    case CartItemActionType.CREATED:
      res.status(201).json({ productId });
      return;
    case CartItemActionType.UPDATED:
      res.status(200).json({ productId, quantity: cartItem.quantity})
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
  const userId = req.headers['x-user-id'] as string;
  const { type, message } = await removeProductFromCart(id, userId);
  
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
  const userId = req.headers['x-user-id'] as string;

  if (quantity == null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const { type, message } = await updateCartItemQuantity(id, userId, quantity);
  
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
  const userId = req.headers['x-user-id'] as string;
  const { data } = await calculateCartTotal(userId);

  res.json({ total: data?.total });
};
