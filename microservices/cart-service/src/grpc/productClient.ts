import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';

const PROTO_PATH = path.join(__dirname, 'product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(packageDefinition).products as any;
const client = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());

export default client;
