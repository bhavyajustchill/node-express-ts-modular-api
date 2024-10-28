import express from "express";
import {
  registerUser,
  loginUser,
  sendResetPasswordOtp,
  resetPasswordWithOtp,
  updateProfile,
  updatePassword,
  updateProfileImage,
} from "./user.controller";
import { authenticateToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send/otp", sendResetPasswordOtp);
router.post("/reset/password", resetPasswordWithOtp);
router.put("/update/profile", [authenticateToken], updateProfile);
router.patch("/update/password", [authenticateToken], updatePassword);
router.patch("/update/profile-picture", [authenticateToken], updateProfileImage);

export default router;
