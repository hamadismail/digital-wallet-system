import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletService } from "./wallet.service";

const createWallet = catchAsync(
  async (req: Request, res: Response) => {
    const wallet = await WalletService.createWallet(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Wallet Created Successfully",
      data: wallet,
    });
  }
);


export const WalletControllers = {
  createWallet,
};
