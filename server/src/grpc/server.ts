import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';
import { getProductForRPC } from "../services/products";

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
  server.addService(productProto.ProductService.service, { GetProduct: getProductForRPC });

  const bindAddress = '0.0.0.0:50051';
  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind gRPC server:', err);
      return;
    }

    console.log(`gRPC server running at ${bindAddress}`);
  })
};
