import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js"

export const get_user = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>,
) => {
  callback(null, { name: "Jon Prell" });
};
