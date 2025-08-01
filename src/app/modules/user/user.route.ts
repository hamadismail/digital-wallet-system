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

router.get("/user/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);

router.patch(
  "/user/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

// User Wallet route
router.post(
  "/user/add-money",
  checkAuth(Role.USER),
  TransactionController.addMoney
);
// /api/v1/user/:id
export const UserRoutes = router;
