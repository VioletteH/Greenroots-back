import Joi from 'joi';

//JOI - LoginShema
export const loginSchema = Joi.object({
  email: Joi.string()
  .email()
  .trim()
  .lowercase()
  .required()
  .messages({
    'string.email': 'Email - invalid',
    'string.empty': 'Email - requiered',
    'any.required': 'Email - requiered',
  }),
  
  password: Joi.string()
  .trim()
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
    'string.min': 'Password - min 8 characters',
    'string.empty': 'Password - requiered',
    'any.required': 'Password - requiered',
  }),
});

//JOI - ForestShema

export const forestSchema = Joi.object({
  name: Joi.string().required(),
  association: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  country: Joi.string().required(),
  location_x: Joi.number().precision(6).required(),
  location_y: Joi.number().precision(6).required()
});

//JOI - orderShema
export const orderSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  total_price: Joi.number().precision(2).positive().required(),
  status: Joi.number().integer().required()
});

//JOI - treeShema

const treeSchema = Joi.object({
  name: Joi.string().required(),
  scientific_name: Joi.string().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  co2: Joi.number().precision(2).positive().required(),
  o2: Joi.number().precision(2).positive().required(),
  price: Joi.number().precision(2).positive().required()
});
