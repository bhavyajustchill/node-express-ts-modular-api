import Joi from "joi";

export const registerUserValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+]{3,30}$")).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user").default("user"),
});

export const loginUserValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
