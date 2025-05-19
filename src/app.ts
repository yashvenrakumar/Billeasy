import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import reviewRoutes from "./routes/review.routes";
//  import { sendResponse } from "../src/middleware/res.middleware";
 
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/users", userRoutes);         // /register, /login
app.use("/api/v1/books", bookRoutes);         // /, /:id, /search/query
app.use("/api/v1", reviewRoutes);             // /books/:id/reviews, /reviews/:id

// // Health check / fallback
// app.get("/", (_req, res) => sendResponse(res, 200, "Book Review API is running"));

// // 404 fallback
// app.use("*", (_req, res) => sendResponse(res, 404, "Route not found"));

 

export default app;
