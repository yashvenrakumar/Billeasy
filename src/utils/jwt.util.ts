import jwt from "jsonwebtoken";

 
// 🔹 Generate Access Token (Expires in 10h)
export const generateToken = (payload: { id: string; name?: string , email?:string}) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "10h" });
};

// 🔹 Generate Refresh Token (Expires in 7 days)
export const generateRefreshToken = (payload: { id: string; name?: string , email?:string}) => {
  console.log(' process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" }',  process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" })
   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
};

// 🔹 Verify Access Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// 🔹 Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

// 🔹 Decode Token (Without Verification)
export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

// 🔹 Refresh Access Token Using Refresh Token
export const refreshAccessToken = (refreshToken: string) => {
  try {
    const decoded: any = verifyRefreshToken(refreshToken);
    return generateToken({ id: decoded.id, name: decoded.name });
  } catch (error) {
    throw new Error("Cannot refresh invalid or expired token");
  }
};
