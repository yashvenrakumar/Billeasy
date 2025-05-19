import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/user.service";
import { sendResponse } from "../middleware/res.middleware";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = { ...req.body };

    const { user, accessToken, refreshToken } = await registerUserService(userData);

    sendResponse(res, 201, "User registered", { user, accessToken, refreshToken });
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password);

    if (!result.success) {
      sendResponse(res, result.status, result.message);
      return;
    }

    sendResponse(res, 200, result.message, { token: result.token });
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};
