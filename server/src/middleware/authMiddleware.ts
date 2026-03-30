import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/**
 * Auth Middleware: protect
 * This middleware intercepts incoming requests to protected routes.
 * If valid, it attaches the user ID to the request object and allows the request to proceed.
 */
export const protect = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Ej behörig, ingen token hittades" });
  }

  try {
    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token using the JWT_SECRET
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "hemlighet",
    );

    // Attach the user ID to the request
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    // If the token is invalid, return a 401 Unauthorized response
    res.status(401).json({ message: "Ej behörig, ogiltig token" });
  }
};
