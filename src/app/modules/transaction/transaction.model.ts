import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number },
    type: {
      type: String,
      enum: Object.values(TransactionType),
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.COMPLETE,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Transactions = model<ITransaction>(
  "Transactions",
  transactionSchema
);
