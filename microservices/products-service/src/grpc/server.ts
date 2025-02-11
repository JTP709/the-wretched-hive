import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';
import { get_product_rpc, get_products_rpc } from "../controllers";

const PROTO_PATH = path.join(__dirname, 'product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = grpc.loadPackageDefinition(packageDefinition).products as any;

export const main = () => {
  const server = new grpc.Server();
  server.addService(productProto.ProductService.service, { 
    GetProduct: get_product_rpc,
    GetProducts: get_products_rpc,
  });

  const bindAddress = '0.0.0.0:50052';
  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) {
      console.error('Failed to bind gRPC server:', err);
      return;
    }

    console.log(`gRPC server running at ${bindAddress}`);
  });
};
