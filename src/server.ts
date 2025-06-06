import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
