import { Router } from "express";
import { WalletControllers } from "./wallet.controller";

const router = Router();

router.post("/create", WalletControllers.createWallet);

export const WalletRoutes = router;
