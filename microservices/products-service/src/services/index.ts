import * as grpc from "@grpc/grpc-js";
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

export const getProductForRPC = async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
  const productId = call.request.productId;
  const { data } = await getProduct(productId);
  const product = (data as Product)?.dataValues;

  callback(null, product);
};

export const getProductsForRPC = async (
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
      case ProductsActionType.NOT_FOUND:
        callback(null, { total: 0, totalPages: 0, products: [] });
      default:
        callback({ code: grpc.status.INTERNAL, message: 'Internal server error '});
    }
  } catch (err: any) {
    callback({ code: grpc.status.INTERNAL, message: err?.message });
  }
};
