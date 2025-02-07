import { User } from "../model";

export enum UsersActionType {
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
}

type UsersServiceResult = Promise<{
  type: UsersActionType,
  message?: string,
  data?: User,
}>

export const getUser = async (userId: string): UsersServiceResult => {
  const user = await User.findOne({
    attributes: ['username'],
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      type: UsersActionType.NOT_FOUND,
      message: "User not found",
    }
  }

  return {
    type: UsersActionType.SUCCESS,
    data: user,
  }
};
