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
  role: {
    type: String,
    enum: ["admin", "user"], // Allow only 'admin' and 'user' roles
    default: "user",
  },
});

interface UserDocument extends UserInterface, Document {}

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
