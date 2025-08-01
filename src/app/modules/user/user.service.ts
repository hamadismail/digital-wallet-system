import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { IUser, Role, Status } from "./user.interface";
import { User } from "./user.model";
import { Wallet } from "../wallet/wallet.model";
import { startSession } from "mongoose";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });

  const session = await startSession();
  session.startTransaction();

  try {
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
    }

    const hashedPassword = await bcryptjs.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const user = await User.create(
      [{ email, password: hashedPassword, ...rest }],
      { session }
    );

    await Wallet.create(
      [
        {
          userId: user[0]._id,
          name: user[0].name,
          email: user[0].email,
          balance: 50,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return user[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (
    payload.status === Status.ACTIVE ||
    payload.status === Status.BLOCKED ||
    payload.status === Status.INACTIVE
  ) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

const makeAgent = async (payload: Partial<IUser>, decodedToken: JwtPayload) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
    throw new AppError(401, "You are not authorized");
  }

  const ifUserExist = await User.findById(payload._id);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const user = await User.findByIdAndUpdate(
    payload._id,
    { role: payload.role },
    {
      new: true,
      runValidators: true,
    }
  );

  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  makeAgent,
};
