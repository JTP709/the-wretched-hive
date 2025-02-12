import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { createNewUser } from "../services";

enum UsersActionType {
  SUCCESS = "SUCCESS",
  CREATED = "CREATED",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
}

export const get_user = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_signup = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const {
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
  } = call.request;
  const missingFields = [];
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");
  if (!email) missingFields.push("email");
  if (!firstName) missingFields.push("firstName");
  if (!lastName) missingFields.push("lastName");
  if (!streetAddress) missingFields.push("streetAddress");
  if (!streetAddressTwo) missingFields.push("streetAddressTwo");
  if (!city) missingFields.push("city");
  if (!planet) missingFields.push("planet");
  if (!postalCode) missingFields.push("postalCode");
  if (missingFields.length) {
    callback(null, {
      type: UsersActionType.BAD_REQUEST,
      message: `The following fields are required: ${missingFields.join()}`,
    });
  }

  await createNewUser({
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
  })
    .then(() => {
      callback(null, {
        type: UsersActionType.SUCCESS,
        message: `New user ${username} created.`,
      });
    })
    .catch((err: any) => {
      if (err?.message === "Username already exists") {
        callback(null, {
          type: UsersActionType.CONFLICT,
          message: "Username already exists",
        });
      } else {
        console.error(err);
        callback(null, {
          code: status.INTERNAL,
          message: err?.message || "Internal server error",
        });
      }
    });
};

export const post_login = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_logout = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_refresh_token = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_forgot_password = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_reset_password = (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};
