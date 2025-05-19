import { RequestHandler, Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  searchBooks,
} from "../controllers/book.controller";
import { validate } from "../validation/validation";
import { bookValidation } from "../validation/book.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const auth = authMiddleware as RequestHandler;


// POST /books – Add a new book (Authenticated)
router.post("/", auth, validate(bookValidation), createBook);

// GET /books – Get all books (pagination + filters)
router.get("/", getAllBooks);

// GET /books/:id – Book details with reviews and avg rating
router.get("/:id", getBookById);

// GET /search?q=... – Search by title/author
router.get("/search/query", searchBooks);

export default router;
