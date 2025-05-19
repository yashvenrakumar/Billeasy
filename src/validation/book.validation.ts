import Joi from "joi";

export const bookValidation = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  author: Joi.string().min(2).max(50).required(),
  genre: Joi.string().min(2).max(30).required(),
  description: Joi.string().max(500).optional(),
  publishedYear: Joi.number().integer().min(0).max(new Date().getFullYear()).optional(),
});
