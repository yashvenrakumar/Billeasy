// middleware/sendResponse.ts
import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
): Response => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};
