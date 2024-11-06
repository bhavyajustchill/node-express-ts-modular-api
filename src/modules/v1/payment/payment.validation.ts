import Joi from "joi";

export const createOrderValidation = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().default("INR"),
  receipt: Joi.string().optional(),
});

export const verifyPaymentValidation = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  amount: Joi.number().positive().optional(),
  currency: Joi.string().optional(),
  receipt: Joi.string().optional(),
});
