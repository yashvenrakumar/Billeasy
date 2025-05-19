// middleware/authenticateToken.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import { sendResponse } from './res.middleware';

interface AuthenticatedRequest extends Request {
  user?: any; // Replace `any` with your decoded token type if known
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    sendResponse(res, 401, "Access token required");
    return;
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    sendResponse(res, 403, "Invalid or expired token");
  }
};
