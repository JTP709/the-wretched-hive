import { Request, Response } from "express";
import { Product } from "../model";
import { Op } from "sequelize";

/**
 * GET /products
 * Retrieves a paginated list of products.
 */
export const get_products = async (req: Request, res: Response) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 5;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search ? String(req.query.search).trim() : null;

    const where = searchQuery
      ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { description: { [Op.iLike]: `%${searchQuery}%` } },
        ]
      } : {};

    const { count: total, rows: products } = await Product.findAndCountAll({
      order: [['id', 'ASC']],
      limit,
      offset,
      where,
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /products/:id
 * Retrieves a product by its id.
 */
export const get_product_by_id = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
