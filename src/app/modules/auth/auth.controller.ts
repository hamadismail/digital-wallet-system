import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  setAuthCookie(res, loginInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});


export const AuthControllers = {
  credentialsLogin,
  logout,
};
