import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const createWallet = async (payload: IWallet) => {
  const { user, balance } = payload;

  const wallet = await Wallet.create({
    user,
    balance,
  });

  return wallet;
};

export const WalletService = {
  createWallet,
};
