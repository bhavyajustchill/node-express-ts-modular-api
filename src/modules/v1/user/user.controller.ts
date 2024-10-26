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
    const { error, value } = await registerUserValidation.validateAsync(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userData: User = value;
    const existingUser = await UserModel.findOne({ username: userData.username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new UserModel({ ...userData, password: hashedPassword });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginUserValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User doesn't exist!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
