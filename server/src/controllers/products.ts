import { Request, Response } from "express";
import { handleErrors } from "../utils";
import { getPaginatedProducts, getProduct } from "../services";
import { PaginatedProductsResponse, ProductsActionType } from "../services/products";

/**
 * GET /products
 * Retrieves a paginated list of products.
 */
export const get_products = async (req: Request, res: Response) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 5;
    const searchQuery = req.query.search ? String(req.query.search).trim() : null;
    
    const { type, data, message } = await getPaginatedProducts(searchQuery, limit, page);
    switch(type) {
      case ProductsActionType.SUCCESS:
        const { total, totalPages, products } = data as PaginatedProductsResponse;
        res.status(200).json({
          page,
          limit,
          total,
          totalPages,
          data: products,
        });
        return;
      case ProductsActionType.NOT_FOUND:
        res.status(404).json({ message })
      default:
        res.status(500).json({ message: "Internal server error" });
        return;
    }
  } catch (err) {
    handleErrors(res, err);
  }
};

/**
 * GET /products/:id
 * Retrieves a product by its id.
 */
export const get_product_by_id = async (req: Request, res: Response) => {
  try {
    const { type, data, message } = await getProduct(req.params.id);
    switch(type) {
      case ProductsActionType.SUCCESS:
        res.json(data);
        return;
      case ProductsActionType.NOT_FOUND:
        res.status(404).json({ message });
        return;
      default:
        res.status(500).json({ message: "Internal server error" });
        return;
    }
  } catch (err) {
    handleErrors(res, err);
  }
};
