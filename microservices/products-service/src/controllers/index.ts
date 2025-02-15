import * as grpc from "@grpc/grpc-js";
import {
  getPaginatedProducts,
  getProduct,
  PaginatedProductsResponse,
  ProductsActionType,
} from "../services";
import { Product } from "../models";

export const get_product_rpc = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  const productId = call.request.productId;
  const { data } = await getProduct(productId);
  const product = (data as Product)?.dataValues;

  callback(null, product);
};

export const get_products_rpc = async (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  const { page, limit, searchQuery } = call.request;

  try {
    const result = await getPaginatedProducts(searchQuery, limit, page);
    switch (result.type) {
      case ProductsActionType.SUCCESS:
        const { total, totalPages, products } =
          result.data as PaginatedProductsResponse;
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
        console.log(
          "Get products service did not return a known action type:",
          result.type
        );
        callback({
          code: grpc.status.INTERNAL,
          message: "Internal server error ",
        });
        break;
    }
  } catch (err: any) {
    console.error("Error fetching products", err);
    callback({ code: grpc.status.INTERNAL, message: err?.message });
  }
};

export const get_products_stream = async (
  call: grpc.ServerDuplexStream<any, any>
) => {
  const productIds: Array<string> = [];
  call.on("data", async ({ productId }: { productId: string }) => {
    console.log({ productId });
    productIds.push(productId);
  });

  call.on("end", async () => {
    const productPromises = productIds.map(async (productId: string) => {
      await getProduct(productId)
        .then(({ type, data }) => {
          if (type === ProductsActionType.SUCCESS) {
            const product = (data as any).dataValues as Product;
            call.write({
              id: product.id,
              name: product.name,
              price: product.price,
              category: product.category,
              description: product.description,
              image: product.image,
            });
          }
        })
        .catch((err: any) => {
          console.error(err);
          call.emit("error", err);
        });
    });
    await Promise.all(productPromises);
    console.log("ending stream");
    call.end();
  });
};
