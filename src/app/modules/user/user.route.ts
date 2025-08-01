import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";
import { TransactionController } from "../transaction/transaction.controller";

const router = Router();

// user route
router.post(
  "/user/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/user/all-users",
  checkAuth(Role.ADMIN),
  UserControllers.getAllUsers
);

router.patch(
  "/user/make-agent",
  checkAuth(Role.ADMIN),
  UserControllers.makeAgent
);

router.get("/user/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);

router.patch(
  "/user/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

////////////////////////////
// User Wallet route
///////////////////////////

router.post(
  "/user/add-money",
  checkAuth(Role.USER),
  TransactionController.addMoney
);

router.post(
  "/user/withdraw",
  checkAuth(Role.USER),
  TransactionController.withdrawMoney
);

router.post(
  "/user/send",
  checkAuth(Role.USER),
  TransactionController.sendMoney
);

router.get(
  "/me/transaction-summary",
  checkAuth(Role.USER),
  TransactionController.getTransactionSummary
);

// AGENTS WALLET
router.post(
  "/agent/cash-in",
  checkAuth(Role.AGENT),
  TransactionController.cashIN
);

router.post(
  "/agent/cash-out",
  checkAuth(Role.AGENT),
  TransactionController.cashOUT
);

// /api/v1/user/:id
export const UserRoutes = router;
