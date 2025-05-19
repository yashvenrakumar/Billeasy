import { Request, Response } from "express";
import * as reviewService from "../services/review.service";
import { sendResponse } from "../middleware/res.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await reviewService.createReviewService(req.params.id, req.user.id, req.body);
    sendResponse(res, 201, "Review added", review);
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await reviewService.updateReviewService(req.params.id, req.user.id, req.body);
    sendResponse(res, 200, "Review updated", review);
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};

export const deleteReview = async (req: AuthRequest
  , res: Response) => {
  try {
    await reviewService.deleteReviewService(req.params.id, req.user.id);
    sendResponse(res, 200, "Review deleted");
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};
