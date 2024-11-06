import express from "express";
import { createOrder, verifyPayment } from "./payment.controller";
import { authenticateToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/create-order", [authenticateToken], createOrder);
router.post("/verify-payment", [authenticateToken], verifyPayment);

export default router;
