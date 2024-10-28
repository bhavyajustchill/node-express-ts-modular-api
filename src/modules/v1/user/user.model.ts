import mongoose, { Schema, Document } from "mongoose";
import { User as UserInterface } from "./user.interface";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // Allow only 'admin' and 'user' roles
    default: "user",
  },
  resetPassword: {
    otp: {
      type: String,
      required: false,
    },
    otpExpiry: {
      type: Date,
      required: false,
    },
  },
});

interface UserDocument extends UserInterface, Document {}

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
