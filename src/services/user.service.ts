import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateRefreshToken, generateToken } from "../utils/jwt.util";

export const registerUserService = async (data: any) => {
  const { password, ...rest } = data;

  if (!password) {
    throw new Error("Password is required for registration");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ ...rest, password: hashedPassword });

  const accessToken = generateToken({
    id: user.password.toString(),
    name: user.firstName,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    id: user.password.toString(),
    name: user.firstName,
    email: user.email,
  });

  return { user, accessToken, refreshToken };
};

export const loginUserService = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; status: number; token?: string }> => {
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, status: 404, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password || "");

  if (!isMatch) {
    return { success: false, status: 401, message: "Invalid email or password" };
  }

  const token = generateToken({
    id: user.id.toString(),
    name: user.firstName,
    email: user.email,
  });

  return { success: true, status: 200, message: "Login successful", token };
};
