Here’s a full backend project setup in **Node.js** with **Express**, **TypeScript**, **MongoDB**, and **JWT authentication**. It follows a clean architecture with proper folder structure inside the `src` directory.

---

### 📂 Folder Structure:
```
backend-project/
│── src/
│   ├── config/
│   │   ├── db.ts
│   ├── controllers/
│   │   ├── user.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   ├── routes/
│   │   ├── user.routes.ts
│   ├── services/
│   │   ├── user.service.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   ├── validation/
│   │   ├── user.validation.ts
│   ├── app.ts
│   ├── server.ts
│── .env
│── package.json
│── tsconfig.json
│── nodemon.json
│── README.md
```

---

## 📌 1. Install Dependencies:
Run the following command to set up the project:

```bash
mkdir backend-project && cd backend-project
npm init -y
npm install express mongoose dotenv jsonwebtoken bcryptjs joi cors helmet morgan
npm install --save-dev typescript ts-node nodemon @types/node @types/express @types/jsonwebtoken @types/mongoose @types/bcryptjs @types/joi
```

---

## 📌 2. Configure TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## 📌 3. Configure Nodemon (`nodemon.json`)
```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/server.ts"
}
```

---

## 📌 4. Setup Environment Variables (`.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/backend_project
JWT_SECRET=your_secret_key
```

---

## 📌 5. Setup Database Connection (`src/config/db.ts`)
```ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 📌 6. Create User Model (`src/models/user.model.ts`)
```ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
```

---

## 📌 7. Create JWT Utility (`src/utils/jwt.util.ts`)
```ts
import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};
```

---

## 📌 8. Create Middleware for Authentication (`src/middleware/auth.middleware.ts`)
```ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
```

---

## 📌 9. User Validation with Joi (`src/validation/user.validation.ts`)
```ts
import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
```

---

## 📌 10. User Services (`src/services/user.service.ts`)
```ts
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.util";

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return { user, token: generateToken(user.id) };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid credentials");

  return { user, token: generateToken(user.id) };
};
```

---

## 📌 11. User Controller (`src/controllers/user.controller.ts`)
```ts
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/user.service";
import { registerValidation, loginValidation } from "../validation/user.validation";

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { user, token } = await registerUser(req.body.name, req.body.email, req.body.password);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { user, token } = await loginUser(req.body.email, req.body.password);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

---

## 📌 12. User Routes (`src/routes/user.routes.ts`)
```ts
import express from "express";
import { register, login } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
```

---

## 📌 13. Setup Express (`src/app.ts`)
```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);

export default app;
```

---

## 📌 14. Start Server (`src/server.ts`)
```ts
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

### 🚀 Run the Server:
```bash
npm run dev
```

Now, your **Node.js + Express + TypeScript + MongoDB** backend is fully set up! 🎯