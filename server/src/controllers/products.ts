import { Request, Response } from "express";
import { handleErrors } from "../utils";
import { getProduct, getProducts } from "../grpc/productClient";

/**
 * GET /products
 * Retrieves a paginated list of products.
 */
export const get_products = async (req: Request, res: Response) => {
  const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
  const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 5;
  const searchQuery = req.query.search ? String(req.query.search).trim() : '';

  try {  
    const { total, totalPages, products: data } = await getProducts(page, limit, searchQuery) as any;
    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data,
    });
  } catch (err) {
    handleErrors(res, err);
  }
};

/**
 * GET /products/:id
 * Retrieves a product by its id.
 */
export const get_product_by_id = async (req: Request, res: Response) => {
  const productId = req.params.id;
  try {
    const {
      id,
      name,
      price,
      category,
      description,
      image,
    } = await getProduct(Number(productId)) as any;
    res.status(200).json({
      id,
      name,
      price,
      category,
      description,
      image,
    });
  } catch (err) {
    handleErrors(res, err);
  }
};
