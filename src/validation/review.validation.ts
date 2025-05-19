import Joi from "joi";

export const reviewValidation = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(300).optional(),
});
