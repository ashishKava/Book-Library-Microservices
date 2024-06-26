import Joi from "joi";

export const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "admin").required(),
  });
  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const bookValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    publishedDate: Joi.date().required(),
    isbn: Joi.string().required(),
  });
  return schema.validate(data);
};
