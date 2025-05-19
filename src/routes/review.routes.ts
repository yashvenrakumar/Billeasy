import { Router, RequestHandler } from "express";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { validate } from "../validation/validation";
import { reviewValidation } from "../validation/review.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Typecast authMiddleware to RequestHandler to satisfy TypeScript
const auth = authMiddleware as RequestHandler;

// POST /books/:id/reviews – Submit a review (1 per user/book)
router.post("/books/:id/reviews", auth, validate(reviewValidation), createReview);

// PUT /reviews/:id – Update your review
router.put("/reviews/:id", auth, validate(reviewValidation), updateReview);

// DELETE /reviews/:id – Delete your review
router.delete("/reviews/:id", auth, deleteReview);

export default router;
