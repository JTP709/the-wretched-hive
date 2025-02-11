import 'dotenv/config';
import path from 'path';
import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import sequelize from './models';
import { addCartItemRPC, getCartItemsRPC, getCartTotalRPC, removeCartItemRPC, updateCartItemRPC } from './controllers';

const PROTO_PATH = path.join(__dirname, './grpc', 'cart.proto');

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const cartProto = loadPackageDefinition(packageDefinition).cart as any;

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

    process.on('exit', () => {
      sequelize.close()
        .then(() => console.log('Closed the database connection successfully'))
        .catch((err: Error) => console.error('Error closing the database connection', err));
    });

    const server = new Server();
    server.addService(cartProto.CartService.service, {
      GetCartItems: getCartItemsRPC,
      AddCartItem: addCartItemRPC,
      UpdateCartItem: updateCartItemRPC,
      RemoveCartItem: removeCartItemRPC,
      GetCartTotal: getCartTotalRPC,
    });

    const bindAddress = "0.0.0.0:50053";

    server.bindAsync(bindAddress, ServerCredentials.createInsecure(), (err) => {
      if (err) {
        console.error("Failed to bind gRPC server:", err);
        return;
      }
      console.log(`Cart gRPC server running at ${bindAddress}`);
    });
  } catch (err) {
    console.error('An error occurred while starting the application', err);
  }
})()
