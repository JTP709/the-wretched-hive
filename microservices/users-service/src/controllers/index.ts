import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {
  authenticateUser,
  createNewUser,
  getUser,
  refreshAccessToken,
  requestResetPasswordEmail,
  resetUserPassword,
  revokeRefreshToken,
} from "../services";

enum UsersActionType {
  SUCCESS = "SUCCESS",
  CREATED = "CREATED",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
  FORBIDDEN = "FORBIDDEN",
}

export const get_user = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { userId } = call.request;
  await getUser(userId)
    .then((user: User) => {
      callback(null, {
        type: UsersActionType.SUCCESS,
        data: user,
      });
    })
    .catch((err: any) => {
      if (err?.message === "User not found") {
        callback(null, {
          type: UsersActionType.NOT_FOUND,
          message: "User not found",
        });
      } else {
        callback(null, {
          code: status.INTERNAL,
          message: err?.message || "Internal server error",
        });
      }
    });
};

export const signup = async (
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

export const login = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { username, password } = call.request;
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

export const logout = async (
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

export const refresh_token = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { refreshToken } = call.request;
  await refreshAccessToken(refreshToken)
    .then((accessToken: string) => {
      callback(null, {
        type: UsersActionType.SUCCESS,
        data: accessToken,
      });
    })
    .catch((err: any) => {
      if (err?.message === "Invalid refresh token") {
        callback(null, {
          type: UsersActionType.FORBIDDEN,
          message: "Invalid refresh token",
        });
      } else {
        callback(null, {
          code: status.INTERNAL,
          message: err?.message || "Internal server error",
        });
      }
    });
};

export const forgot_password = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { email } = call.request;
  await requestResetPasswordEmail(email)
    .then(() => {
      callback(null, {
        type: UsersActionType.SUCCESS,
        message: "If the email exists, reset instructions were sent",
      });
    })
    .catch((err: any) => {
      callback(null, {
        code: status.INTERNAL,
        message: "Internal server error",
      });
    });
};

export const reset_password = async (
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { token, password } = call.request;
  await resetUserPassword(token, password)
    .then(() => {
      callback(null, {
        type: UsersActionType.SUCCESS,
        message: "Password reset successfull",
      });
    })
    .catch((err: any) => {
      if (err?.message === "Invalid or expired token") {
        callback(null, {
          type: UsersActionType.BAD_REQUEST,
          message: "Invalid or expired token",
        });
      } else {
        callback(null, {
          code: status.INTERNAL,
          message: err?.message || "Internal server error",
        });
      }
    });
};
