import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { sendResponse } from "../middleware/res.middleware";

export const validate = (schema: ObjectSchema) => {
   return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      sendResponse(res, 400, message);
      return; // ✅ This line is necessary to satisfy Express's expected return type
    }

    req.body = value;
    next();
  };
};


 