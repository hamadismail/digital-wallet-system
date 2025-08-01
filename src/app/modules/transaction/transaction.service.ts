import { TransactionStatus, TransactionType } from "./transaction.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Transactions } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { startSession, Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const addMoney = async (amount: number, decodedToken: JwtPayload) => {
  // if (decodedToken.role === Role.USER) {
  //   if (userId !== decodedToken.userId) {
  //     throw new AppError(401, "You are not authorized");
  //   }
  // }

  // Check if user exists
  const userWallet = await Wallet.findOne({ user: decodedToken.userId });
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
          userId: decodedToken.userId,
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

const withdrawMoney = async (amount: number, decodedToken: JwtPayload) => {
  // if (decodedToken.role === Role.USER) {
  //   if (userId !== decodedToken.userId) {
  //     throw new AppError(401, "You are not authorized");
  //   }
  // }

  // Check if user exists
  const userWallet = await Wallet.findOne({ user: decodedToken.userId });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (userWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient amount");
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
          userId: decodedToken.userId,
          amount,
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.COMPLETE,
        },
      ],
      { session }
    );

    // Add money to user's wallet balance
    userWallet.balance = (userWallet.balance || 0) - amount;
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

const sendMoney = async (
  userId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  // Check if user exists
  const senderWallet = await Wallet.findOne({ user: decodedToken.userId });

  const receiverWallet = await Wallet.findOne({ user: userId });

  if (!receiverWallet || !senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient amount");
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
          userId: decodedToken.userId,
          amount,
          type: TransactionType.SEND,
          status: TransactionStatus.COMPLETE,
        },
      ],
      { session }
    );

    // Add money to user's wallet balance
    senderWallet.balance = (senderWallet.balance || 0) - amount;
    await senderWallet.save({ session });

    receiverWallet.balance = (receiverWallet.balance || 0) + amount;
    await receiverWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getTransactionSummary = async (decodedToken: JwtPayload) => {
  const userId = new Types.ObjectId(decodedToken.userId);

  const pipeline = [
    {
      $match: {
        userId: userId,
      },
    },
    {
      $group: {
        _id: "$type",
        totalCount: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        // transactions: { $push: "$$ROOT" },
        transactions: {
          $push: {
            amount: "$amount",
          },
        },
      },
    },
  ];

  const results = await Transactions.aggregate(pipeline);

  if (!results || results.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No Transaction found");
  }

  const getGroup = (type: TransactionType) =>
    results.find((r) => r._id === type) || {
      totalCount: 0,
      totalAmount: 0,
      transactions: [],
    };

  return {
    send: {
      count: getGroup(TransactionType.SEND).totalCount,
      amount: getGroup(TransactionType.SEND).totalAmount,
      transactions: getGroup(TransactionType.SEND).transactions,
    },
    withdraw: {
      count: getGroup(TransactionType.WITHDRAW).totalCount,
      amount: getGroup(TransactionType.WITHDRAW).totalAmount,
      transactions: getGroup(TransactionType.WITHDRAW).transactions,
    },
    cashIn: {
      count: getGroup(TransactionType.ADD).totalCount,
      amount: getGroup(TransactionType.ADD).totalAmount,
      transactions: getGroup(TransactionType.ADD).transactions,
    },
  };
};

// AGENT TRANSACTIONS
const cashIN = async (
  userId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  // Check if user exists
  const senderWallet = await Wallet.findOne({ user: userId });
  const receiverWallet = await Wallet.findOne({ user: decodedToken.userId });

  if (!receiverWallet || !senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient amount");
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
          userId: decodedToken.userId,
          amount,
          type: TransactionType.SEND,
          status: TransactionStatus.COMPLETE,
        },
      ],
      { session }
    );

    // Add money to user's wallet balance
    senderWallet.balance = (senderWallet.balance || 0) - amount;
    await senderWallet.save({ session });

    receiverWallet.balance = (receiverWallet.balance || 0) + amount;
    await receiverWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cashOUT = async (
  userId: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  // Check if user exists
  const senderWallet = await Wallet.findOne({ user: decodedToken.userId });
  const receiverWallet = await Wallet.findOne({ user: userId });

  if (!receiverWallet || !senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient amount");
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
          userId: decodedToken.userId,
          amount,
          type: TransactionType.SEND,
          status: TransactionStatus.COMPLETE,
        },
      ],
      { session }
    );

    // Add money to user's wallet balance
    senderWallet.balance = (senderWallet.balance || 0) - amount;
    await senderWallet.save({ session });

    receiverWallet.balance = (receiverWallet.balance || 0) + amount;
    await receiverWallet.save({ session });

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
  withdrawMoney,
  sendMoney,
  getTransactionSummary,
  cashIN,
  cashOUT
};
