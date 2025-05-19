import { Router } from "express";
 import { validate } from "../validation/validation";
import { userLoginValidation, userProfileValidation } from "../validation/user.validation";
import { registerUser, loginUser } from "../controllers/user.controller";
 
 
const router = Router();

router.post(
  "/register",
  validate(userProfileValidation),
  registerUser
);
 router.post("/login", validate(userLoginValidation), loginUser);

  
export default router;
 
