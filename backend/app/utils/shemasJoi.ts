import Joi from 'joi';

//JOI - LoginShema
export const loginSchema = Joi.object({
  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Email - invalid',
    'string.empty': 'Email - requiered',
    'any.required': 'Email - requiered',
  }),
  
  password: Joi.string()
  .required()
  .messages({
    'string.empty': 'Password - requiered',
    'any.required': 'Password - requiered',
  }),
});

//JOI - RegisterShema 
export const registerSchema = Joi.object({
  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Email - invalid',
    'string.empty': 'Email - requiered',
    'any.required': 'Email - requiered',
  }),
  
  password: Joi.string()
  .min(8)
  .required()
  .messages({
    'string.min': 'Password or email - invalid',
    'string.empty': 'Password - requiered',
    'any.required': 'Password - requiered',
  }),
});
