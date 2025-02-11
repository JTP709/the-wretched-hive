import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';

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

export default client;
