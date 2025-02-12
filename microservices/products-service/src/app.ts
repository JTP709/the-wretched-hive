import 'dotenv/config';
import sequelize from './models';
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';
import { get_product_rpc, get_products_rpc } from "./controllers";

const PROTO_PATH = path.join(__dirname, 'proto', 'product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = grpc.loadPackageDefinition(packageDefinition).products as any;

const onShutdown = async () => {
  try {
    await sequelize.close();
    console.log('Closed the database connection successfully');
  } catch (err) {
    console.error('Error closing the database connection', err);
  } finally {
    process.exit();
  }
};

(async function Main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    if(process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      // await sequelize.sync({ alter: true });
      // use if error occurs WARNING: this will delete all data
      // await sequelize.sync({ force: true })
      console.log('All models were synchronized successfully');
    }

    process.on('SIGINT', onShutdown);
    process.on('SIGTERM', onShutdown);

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
  } catch (err) {
    console.error('An error occurred while starting the application', err);
  }
})()
