import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';
import { grpcPromise } from "./utils";

const PROTO_PATH = path.join(__dirname, 'product.proto');
const PRODUCT_SERVICE_PATH = process.env.PRODUCT_SERVICE_RPC_PATH || 'localhost:50052';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(packageDefinition).products as any;
const client = new productProto.ProductService(PRODUCT_SERVICE_PATH, grpc.credentials.createInsecure());

export const getProducts = (page: number, limit: number, searchQuery: string): Promise<any> => {
  return grpcPromise(client.GetProducts.bind(client), { page, limit, searchQuery });
};

export const getProduct = (productId: number): Promise<any> => {
  return grpcPromise(client.GetProduct.bind(client), { productId })
};

export default client;
