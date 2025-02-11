import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import path from 'path';
import { grpcPromise } from './utils';

const PROTO_PATH = path.join(__dirname, "cart.proto");
const CART_SERVICE_ADDRESS = process.env.CART_SERVICE_RPC_ADDRESS || "localhost:50053";

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const cartProto = loadPackageDefinition(packageDefinition).cart as any;

const client = new cartProto.CartService(
  CART_SERVICE_ADDRESS,
  credentials.createInsecure(),
);

export const getCartItems = (userId: string): Promise<any> => {
  return grpcPromise(client.GetCartItems.bind(client), { userId });
};

export const addCartItem = (userId: string, productId: number): Promise<any> => {
  return grpcPromise(client.AddCartItem.bind(client), { userId, productId });
};

export const updateCartItem = (userId: string, cartItemId: number, quantity: number): Promise<any> => {
  return grpcPromise(client.UpdateCartItem.bind(client), { userId, cartItemId, quantity });
};

export const removeCartItem = (userId: string, cartItemId: number): Promise<any> => {
  return grpcPromise(client.RemoveCartItem.bind(client), { userId, cartItemId });
};

export const getCartTotal = (userId: string): Promise<any> => {
  return grpcPromise(client.GetCartTotal.bind(client), { userId });
};

export default client;
