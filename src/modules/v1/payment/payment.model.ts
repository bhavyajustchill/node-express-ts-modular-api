import mongoose, { Schema, Document } from "mongoose";
import { Payment as PaymentInterface } from "./payment.interface";

const PaymentSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    receipt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["created", "paid", "failed"],
    },
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

interface PaymentDocument extends PaymentInterface, Document {}

const PaymentModel = mongoose.model<PaymentDocument>("Payment", PaymentSchema);

export default PaymentModel;
