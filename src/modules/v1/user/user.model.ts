import mongoose, { Schema, Document } from "mongoose";

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
  role: {
    type: String,
    enum: ["admin", "user"], // Allow only 'admin' and 'user' roles
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

export interface UserDocument extends Document {
  username: string;
  password: string;
  role: "admin" | "user";
  isVerified: boolean;
  verificationToken?: string;
}

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
