import mongoose, { Document, Types } from "mongoose";

export interface IReview extends Document {
  book: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// One review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", reviewSchema);
