import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/**
 * Auth Middleware: protect
 * This middleware intercepts incoming requests to protected routes.
 * If valid, it attaches the user ID to the request object and allows the request to proceed.
 */
export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  // Check if the request contains a valid token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

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
  }

  // If no token was found in the request
  if (!token) {
    res.status(401).json({ message: "Ej behörig, ingen token hittades" });
  }
};
