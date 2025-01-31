// controllers/cartItemsController.ts
import { Request, Response } from "express";
import { CartItem, Product } from "../model"; // adjust the import path as needed

/**
 * GET /cart-items
 * Retrieves all cart items along with associated product details.
 */
export const get_cart_items = async (_: Request, res: Response) => {
  try {
    const cartItems = await CartItem.findAll({
      include: [
        {
          model: Product,
          attributes: ['name', 'price', 'image', 'category', 'description'],
        },
      ],
    });
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /cart-items
 * Creates a new cart item or increments the quantity of an existing cart item.
 */
export const post_cart_items = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  try {
    // Try to find an existing cart item with the same productId.
    const [cartItem, created] = await CartItem.findOrCreate({
      where: { productId },
      defaults: { quantity },
    });
    
    if (!created) {
      // If it already exists, increment the quantity.
      cartItem.quantity += quantity;
      await cartItem.save();
    }
    
    res.status(201).json({ productId, quantity: cartItem.quantity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /cart-items/:id
 * Deletes a cart item by its id.
 */
export const delete_cart_items = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await CartItem.destroy({
      where: { id },
    });
    
    if (deleted) {
      res.status(204).json({ id });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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

  if (quantity === undefined || quantity === null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    if (quantity <= 0) {
      // If the quantity is zero or negative, delete the cart item.
      const deleted = await CartItem.destroy({ where: { id } });

      if (deleted) {
        res.status(204).json({ id });
        return;
      } else {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }
    } else {
      // Otherwise, update the quantity.
      const cartItem = await CartItem.findByPk(id);

      if (!cartItem) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }

      cartItem.quantity = quantity;
      await cartItem.save();
      res.json({ id, quantity });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
