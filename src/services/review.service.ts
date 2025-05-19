import Review from "../models/review.model";

export const createReviewService = async (bookId: string, userId: string, data: any) => {
  return await Review.create({ ...data, book: bookId, user: userId });
};

export const updateReviewService = async (reviewId: string, userId: string, data: any) => {
  const review = await Review.findOneAndUpdate({ _id: reviewId, user: userId }, data, {
    new: true,
  });
  if (!review) throw new Error("Review not found or unauthorized");
  return review;
};

export const deleteReviewService = async (reviewId: string, userId: string) => {
  const result = await Review.findOneAndDelete({ _id: reviewId, user: userId });
  if (!result) throw new Error("Review not found or unauthorized");
};
