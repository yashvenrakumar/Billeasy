import Book from "../models/book.model";
import Review from "../models/review.model";
import mongoose from "mongoose";

export const createBookService = async (data: any, userId: string) => {
  return await Book.create({ ...data, createdBy: userId });
};

export const getAllBooksService = async ({
  page,
  limit,
  author,
  genre,
}: {
  page: number;
  limit: number;
  author?: string;
  genre?: string;
}) => {
  const filter: any = {};
  if (author) filter.author = author;
  if (genre) filter.genre = genre;

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  const count = await Book.countDocuments(filter);

  return { books, totalPages: Math.ceil(count / limit), currentPage: page };
};

export const getBookDetailsService = async (bookId: string, pageQuery: any) => {
  const page = parseInt(pageQuery?.page || "1");
  const limit = 5;

  const book = await Book.findById(bookId);
  if (!book) throw new Error("Book not found");

  const reviews = await Review.find({ book: bookId })
    .populate("user", "firstName lastName")
    .skip((page - 1) * limit)
    .limit(limit);

  const totalReviews = await Review.countDocuments({ book: bookId });
  const avgRating =
    totalReviews > 0
      ? (await Review.aggregate([
          { $match: { book: new mongoose.Types.ObjectId(bookId) } },
          { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]))[0]?.avg || 0
      : 0;

  return {
    book,
    averageRating: avgRating.toFixed(2),
    reviews,
    totalReviews,
    currentPage: page,
    totalPages: Math.ceil(totalReviews / limit),
  };
};

export const searchBooksService = async (query: string) => {
  return await Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { author: { $regex: query, $options: "i" } },
    ],
  });
};
