// controllers/checkoutController.ts
import { Request, Response } from "express";
import sequelize, { CartItem, Product, Order } from "../model"; // adjust the path as needed

/**
 * GET /checkout/total
 * Retrieves the total checkout amount by calculating the sum of (quantity * price) 
 * across all cart items.
 */
export const get_checkout_total = async (_: Request, res: Response) => {
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
          attributes: [] // no need to retrieve product fields
        }
      ],
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

/**
 * POST /checkout
 * Creates a new order with the provided customer and checkout details.
 */
export const post_checkout = async (req: Request, res: Response) => {
  const { name, email, address, phone, total } = req.body;

  if (!name || !email || !address || !phone || total === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Create a new order using the Order model.
    const order = await Order.create({ name, email, address, phone, total });
    res.status(201).json({ id: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
