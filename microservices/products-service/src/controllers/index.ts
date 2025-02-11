import * as grpc from "@grpc/grpc-js";
import { Request, Response } from "express";
import { getPaginatedProducts, getProduct } from "../services";
import { PaginatedProductsResponse, ProductsActionType } from "../services";
import { Product } from "../models";

/**
 * GET /products
 * Retrieves a paginated list of products.
 */
export const get_products = async (req: Request, res: Response) => {
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
};

/**
 * GET /products/:id
 * Retrieves a product by its id.
 */
export const get_product_by_id = async (req: Request, res: Response) => {
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
};

export const get_product_rpc = async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
  const productId = call.request.productId;
  const { data } = await getProduct(productId);
  const product = (data as Product)?.dataValues;

  callback(null, product);
};

export const get_products_rpc = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
) => {
  const { page, limit, searchQuery } = call.request;

  try {
    const result = await getPaginatedProducts(searchQuery, limit, page);
    switch(result.type) {
      case ProductsActionType.SUCCESS:
        const { total, totalPages, products } = result.data as PaginatedProductsResponse;
        const protoProducts = products.map((product: Product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          image: product.image,
        }));
        callback(null, { total, totalPages, products: protoProducts });
        break;
      case ProductsActionType.NOT_FOUND:
        callback(null, { total: 0, totalPages: 0, products: [] });
        break;
      default:
        console.log("Get products service did not return a known action type:", result.type);
        callback({ code: grpc.status.INTERNAL, message: 'Internal server error '});
        break;
    }
  } catch (err: any) {
    console.error("Error fetching products", err);
    callback({ code: grpc.status.INTERNAL, message: err?.message });
  }
};
