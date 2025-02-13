import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";
import { grpcPromise } from "./utils";

const PROTO_PATH = path.join(__dirname, "users.proto");
const USERS_SERVICE_ADDRESS =
  process.env.USERS_SERVICE_ADDRESS || "localhost:50054";

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const usersProto = loadPackageDefinition(packageDefinition).users as any;

const client = new usersProto.UsersService(
  USERS_SERVICE_ADDRESS,
  credentials.createInsecure()
);

export const GetUser = (userId: string): Promise<any> => {
  return grpcPromise(client.GetUser.bind(client), { userId });
};

export const SignUp = (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  streetAddress: string,
  streetAddressTwo: string,
  city: string,
  planet: string,
  postalCode: string
): Promise<any> => {
  return grpcPromise(client.SignUp.bind(client), {
    username,
    password,
    email,
    firstName,
    lastName,
    streetAddress,
    streetAddressTwo,
    city,
    planet,
    postalCode,
  });
};

export const Login = (username: string, password: string): Promise<any> => {
  return grpcPromise(client.Login.bind(client), { username, password });
};

export const Logout = (refreshToken: string): Promise<any> => {
  return grpcPromise(client.Logout.bind(client), { refreshToken });
};

export const RefreshToken = (refreshToken: string): Promise<any> => {
  return grpcPromise(client.RefreshToken.bind(client), { refreshToken });
};

export const ForgotPassword = (email: string): Promise<any> => {
  return grpcPromise(client.ForgotPassword.bind(client), { email });
};

export const ResetPassword = (
  token: string,
  password: string
): Promise<any> => {
  return grpcPromise(client.ResetPassword.bind(client), { token, password });
};
