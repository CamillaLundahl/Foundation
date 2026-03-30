import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Register new user
 * Handles user sign-up, password hashing, and automatic login upon success.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Hash and salt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "hemlighet",
      { expiresIn: "30d" },
    );

    // Send the token and username in the response
    res.status(201).json({
      token,
      username: newUser.username,
      message: "Användare skapad och inloggad!",
    });
  } catch (error) {
    // Error handling for user creation
    res.status(500).json({
      message: "Kunde inte skapa användare (namnet kan vara upptaget)",
    });
  }
};

// Login user, generates JWT token
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    // Compare password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Fel användarnamn eller lösenord" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "hemlighet",
      { expiresIn: "30d" },
    );

    // Send the token and username in the response
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Serverfel vid inloggning" });
  }
};
