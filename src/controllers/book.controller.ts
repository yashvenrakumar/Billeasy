import { Request, Response } from "express";
import * as bookService from "../services/book.service";
import { sendResponse } from "../middleware/res.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // safe access
    const book = await bookService.createBookService(req.body, userId);
    sendResponse(res, 201, "Book created", book);
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};


export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const books = await bookService.getAllBooksService({
      page: Number(page),
      limit: Number(limit),
      author: String(author),
      genre: String(genre),
    });
    sendResponse(res, 200, "Books fetched", books);
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await bookService.getBookDetailsService(req.params.id, req.query.page as any);
    sendResponse(res, 200, "Book details fetched", book);
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const result = await bookService.searchBooksService(String(q));
    sendResponse(res, 200, "Search result", result);
  } catch (err: any) {
    sendResponse(res, 500, err.message);
  }
};
