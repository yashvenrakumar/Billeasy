import Joi from "joi";

export const userProfileValidation = Joi.object({
  firstName: Joi.string().min(4).max(20).regex(/^\S+$/).required(),
  lastName: Joi.string().min(4).max(20).regex(/^\S+$/).required(),
  email: Joi.string(),
  password: Joi.string().optional(),
});

export const userLoginValidation = Joi.object({
  email: Joi.string(),
  password: Joi.string().optional(),
});
 