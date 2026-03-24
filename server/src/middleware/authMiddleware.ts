import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "hemlighet",
      );

      req.user = { id: decoded.id };

      next();
    } catch (error) {
      res.status(401).json({ message: "Ej behörig, ogiltig token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Ej behörig, ingen token hittades" });
  }
};
