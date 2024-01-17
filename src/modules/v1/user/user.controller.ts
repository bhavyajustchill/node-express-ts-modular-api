import { Request, Response } from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "./user.model";
import { User } from "./user.interface";
import { registerUserValidation, loginUserValidation } from "./user.validation";
import dotenv from "dotenv";

dotenv.config();

const secretKey: string = process.env.JWT_SECRET as string;

const transporter = nodemailer.createTransport({
  // Configure your email provider here
  // For example, if using Gmail:
  service: "gmail",
  auth: {
    user: "bhavya.popat.8@gmail.com",
    pass: "hqtk rnnn oqji vxki",
  },
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerUserValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userData: User = value;
    const existingUser = await UserModel.findOne({
      username: userData.username,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = generateVerificationToken();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
      verificationToken,
    });

    const savedUser = await newUser.save();

    // Send verification email
    const verificationLink = `http://your-app-domain.com/verify/${verificationToken}`;
    const emailHtml = getVerificationEmailHtml(verificationLink);
    await sendVerificationEmailInternal(savedUser.username, emailHtml);

    res.status(201).json({
      message: "User registered. Please check your email for verification.",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // Mark user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Send verification success HTML page
    const verificationSuccessHtml = getVerificationSuccessHtml();
    res.status(200).send(verificationSuccessHtml);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

function sendVerificationEmailInternal(email: string, htmlContent: string) {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Email Verification",
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

function getVerificationEmailHtml(verificationLink: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <!-- Add Bootstrap CDN link -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-TgMqQswvELPnIlq6Xj4ovJ1mgw5QqwiQr5Y07fG4FE+4zEmnMLYoGOoD86JOQwJZ" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <div class="card mt-5">
          <div class="card-body">
            <h5 class="card-title">Email Verification</h5>
            <p class="card-text">Click the link below to verify your email address:</p>
            <a href="${verificationLink}" class="btn btn-primary">Verify Email</a>
          </div>
        </div>
      </div>
      <!-- Add Bootstrap JS and Popper.js CDN links if needed -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-pzjw8+8ZFve7yoC83LXve9AdmQU3XSGEnQ8UJv7EjFwJ8GavPrU1mi4L2t9O6dj" crossorigin="anonymous"></script>
    </body>
    </html>
  `;
}

function getVerificationSuccessHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification Success</title>
      <!-- Add Bootstrap CDN link -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-TgMqQswvELPnIlq6Xj4ovJ1mgw5QqwiQr5Y07fG4FE+4zEmnMLYoGOoD86JOQwJZ" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <div class="card mt-5">
          <div class="card-body">
            <h5 class="card-title">Email Verification Success</h5>
            <p class="card-text">Your email has been successfully verified.</p>
            <a href="/" class="btn btn-primary">Go to Home</a>
          </div>
        </div>
      </div>
      <!-- Add Bootstrap JS and Popper.js CDN links if needed -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-pzjw8+8ZFve7yoC83LXve9AdmQU3XSGEnQ8UJv7EjFwJ8GavPrU1mi4L2t9O6dj" crossorigin="anonymous"></script>
    </body>
    </html>
  `;
}

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

    const token = jwt.sign(
      { username: user.username, role: user.role },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

function generateVerificationToken() {
  // Generate a random verification token
  // You can use a library like crypto to create a secure token
  // For simplicity, this example uses a random string
  return Math.random().toString(36).substring(7);
}
