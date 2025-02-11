import { Op } from "sequelize";
import { Product } from "../models";

export enum ProductsActionType {
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
}

export type PaginatedProductsResponse = {
  total: number,
  totalPages: number,
  products: Product[],
}

type ProductsServiceResult = Promise<{
  type: ProductsActionType,
  message?: string,
  data?: Product | PaginatedProductsResponse,
}>

export const getPaginatedProducts = async (searchQuery: string | null, limit: number, page: number): ProductsServiceResult => {
  const offset = (page - 1) * limit;
  const where = searchQuery
  ? {
    [Op.or]: [
      { name: { [Op.like]: `%${searchQuery}%` } },
      { description: { [Op.like]: `%${searchQuery}%` } },
    ]
  } : {};

  const { count: total, rows: products } = await Product.findAndCountAll({
    order: [['id', 'ASC']],
    limit,
    offset,
    where,
  });

  const totalPages = Math.ceil(total / limit);

  if (products.length === 0) {
    return {
      type: ProductsActionType.NOT_FOUND,
    }
  }

  return {
    type: ProductsActionType.SUCCESS,
    data: {
      total,
      totalPages,
      products,
    },
  };
};

export const getProduct = async (productId: string): ProductsServiceResult => {
  const product = await Product.findByPk(productId);

  if (!product) {
    return {
      type: ProductsActionType.NOT_FOUND,
      message: "Product not found",
    }
  }

  return {
    type: ProductsActionType.SUCCESS,
    data: product,
  }
};
