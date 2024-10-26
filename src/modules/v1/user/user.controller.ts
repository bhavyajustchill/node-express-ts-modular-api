import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "./user.model";
import { User } from "./user.interface";
import { registerUserValidation, loginUserValidation } from "./user.validation";
import dotenv from "dotenv";

dotenv.config();

const secretKey: string = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validated: any = await registerUserValidation.validateAsync(req.body);

    const userData: User = validated;

    const existingUser = await UserModel.findOne({ email: userData.email });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new UserModel({ ...userData, password: hashedPassword });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validated: any = await registerUserValidation.validateAsync(req.body);

    const userData: User = validated;

    const userToLogin = await UserModel.findOne({ email: userData.email });

    if (!userToLogin) {
      return res.status(401).json({ message: "User doesn't exist!" });
    }

    const passwordMatch = await bcrypt.compare(userData.password, userToLogin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: userToLogin.username, email: userToLogin.email, role: userToLogin.role },
      secretKey,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({ token, role: userToLogin.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
