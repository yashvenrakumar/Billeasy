import mongoose, { Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  description?: string;
  averageRating: number;
  createdBy: Types.ObjectId;
}

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String },
    averageRating: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", bookSchema);
