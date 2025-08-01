import { Types } from "mongoose";

export enum TransactionStatus {
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export enum TransactionType {
  ADD = "ADD",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASHIN = "CASH-IN",
  CASHOUT = "CASH-OUT"
}

export interface ITransaction {
  from: Types.ObjectId;
  to: Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}
