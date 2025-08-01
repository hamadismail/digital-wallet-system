import { TransactionStatus, TransactionType } from "./transaction.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Transactions } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { startSession } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";

const addMoney = async (
  userId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  // Check if user exists
  const userWallet = await Wallet.findOne({ user: userId });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // const amount = payload.amount;
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  // Start transaction session
  const session = await startSession();
  session.startTransaction();

  try {
    // Create transaction
    const transaction = await Transactions.create(
      [
        {
          from: userId,
          to: userId,
          amount,
          type: TransactionType.ADD,
          status: TransactionStatus.COMPLETE,
        },
      ],
      { session }
    );

    // Add money to user's wallet balance
    userWallet.balance = (userWallet.balance || 0) + amount;
    await userWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TransactionService = {
  addMoney,
};
