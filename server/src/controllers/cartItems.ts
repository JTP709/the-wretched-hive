import { Request, Response } from "express";
import sequelize, { CartItem, Product } from "../model";
import { AuthRequest } from "../types/global";
import { Op } from "sequelize";

/**
 * GET /cart-items
 * Retrieves all cart items along with associated product details.
 */
export const get_cart_items = async (req: Request, res: Response) => {
  try {
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
        userId: (req as AuthRequest).userId,
        orderId: {
          [Op.is]: null,
        }
      }
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
  const userId = (req as AuthRequest).userId;
  if (!productId || !quantity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  try {
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
      res.status(200).json({ productId, quantity: existingCartItem.quantity });
      return;
    }
    
    const cartItem = await CartItem.create({
      productId,
      userId,
      quantity,
    });
    
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
  const userId = (req as AuthRequest).userId;

  try {
    const deleted = await CartItem.destroy({
      where: { id, userId },
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
  const userId = (req as AuthRequest).userId;

  if (quantity === undefined || quantity === null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    if (quantity <= 0) {
      // If the quantity is zero or negative, delete the cart item.
      const deleted = await CartItem.destroy({ where: { id, userId } });

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

/**
 * GET /cart/total
 * Retrieves the total cart amount by calculating the sum of (quantity * price) 
 * across all cart items.
 */
export const get_cart_total = async (req: Request, res: Response) => {
  try {
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
        userId: (req as AuthRequest).userId,
        orderId: {
          [Op.is]: null,
        }
      },
      raw: true
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