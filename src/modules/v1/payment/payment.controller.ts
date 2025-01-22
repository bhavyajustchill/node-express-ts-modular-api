import { Request, Response } from "express";
import crypto from "crypto";
import { createOrderValidation, verifyPaymentValidation } from "./payment.validation";
import PaymentModel from "./payment.model";
import { Payment } from "./payment.interface";
import razorpayInstance from "../../../config/razorpay.config";
import dotenv from "dotenv";

dotenv.config();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validated = await createOrderValidation.validateAsync(req.body);

    const options = {
      amount: validated.amount * 100, // Convert amount to smallest currency unit
      currency: validated.currency,
      receipt: validated.receipt || `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const validated = await verifyPaymentValidation.validateAsync(req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validated;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const order = await razorpayInstance.orders.fetch(razorpay_order_id);

      if (!order) {
        return res.status(404).json({ error: "Order not found in Razorpay" });
      }

      const paymentData: Payment = {
        amount: (order.amount as number) / 100, // Convert back to main currency unit
        currency: order.currency,
        receipt: order.receipt as string,
        status: "paid",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
      };

      const payment = new PaymentModel(paymentData);
      await payment.save();

      res.json({ status: "success", payment });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
