import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  authenticateUser,
  createNewUser,
  revokeRefreshToken,
} from "../services";

enum UsersActionType {
  SUCCESS = "SUCCESS",
  CREATED = "CREATED",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
}

export const get_user = async (
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

export const post_login = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { username, password } = call.request;
  if (!username || !password) {
    callback(null, {
      type: UsersActionType.BAD_REQUEST,
      message: "Username and password are required",
    });
  }
  await authenticateUser(username, password)
    .then(({ accessToken, refreshToken }) => {
      callback(null, {
        type: UsersActionType.SUCCESS,
        data: {
          accessToken,
          refreshToken,
        },
      });
    })
    .catch((err: any) => {
      if (err?.message === "Incorrect username or password") {
        callback(null, {
          type: UsersActionType.CONFLICT,
          message: "Incorrect username or password",
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

export const post_logout = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { refreshToken } = call.request;
  await revokeRefreshToken(refreshToken);
  callback(null, {
    type: UsersActionType.SUCCESS,
    message: "Refresh token revoked",
  });
};

export const post_refresh_token = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_forgot_password = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};

export const post_reset_password = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  callback(null, { name: "Jon Prell" });
};
