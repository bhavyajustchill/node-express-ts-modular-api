import Joi from "joi";

export const todoValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  completed: Joi.boolean(),
});
