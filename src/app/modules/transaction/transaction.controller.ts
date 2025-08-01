import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { to, amount } = req.body;
    const verifiedToken = req.user;

    const transaction = await TransactionService.addMoney(
      to,
      amount,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Trasaction Created Successfully",
      data: transaction,
    });
  }
);

export const TransactionController = {
  addMoney,
};
