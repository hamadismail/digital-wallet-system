import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const verifiedToken = req.user;

  const transaction = await TransactionService.addMoney(
    amount,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Trasaction Created Successfully",
    data: transaction,
  });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const verifiedToken = req.user;

  const transaction = await TransactionService.withdrawMoney(
    amount,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Trasaction Created Successfully",
    data: transaction,
  });
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const verifiedToken = req.user;

  const transaction = await TransactionService.sendMoney(
    userId,
    amount,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Trasaction Created Successfully",
    data: transaction,
  });
});

const getTransactionSummary = catchAsync(
  async (req: Request, res: Response) => {
    const verifiedToken = req.user;

    const transaction = await TransactionService.getTransactionSummary(
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Trasaction Retrive Successfully",
      data: transaction,
    });
  }
);

// AGENTS TRANSACTION
const cashIN = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const verifiedToken = req.user;

  const transaction = await TransactionService.cashIN(
    userId,
    amount,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Cash IN Successfully",
    data: transaction,
  });
});

const cashOUT = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const verifiedToken = req.user;

  const transaction = await TransactionService.cashOUT(
    userId,
    amount,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Cash Out Successfully",
    data: transaction,
  });
});

export const TransactionController = {
  addMoney,
  withdrawMoney,
  sendMoney,
  getTransactionSummary,
  cashIN,
  cashOUT,
};
