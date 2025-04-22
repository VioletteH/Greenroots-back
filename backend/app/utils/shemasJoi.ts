import Joi, { optional } from 'joi';

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
  firstname: Joi.string()
  .trim()
  .max(255)
  .required()
  .messages({
    'string.max': 'Firstname - max 255 characters',
    'string.empty': 'Firstname - requiered',
    'any.required': 'Firstname - requiered',
  }),
  // role: Joi.string() - si vous voulez le garder, décommentez cette ligne
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

export const treeSchema = Joi.object({
  name: Joi.string().required(),
  scientific_name: Joi.string().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  co2: Joi.number().precision(2).positive().required(),
  o2: Joi.number().precision(2).positive().required(),
  price: Joi.number().precision(2).positive().required(),
  forestAssociations: Joi.array().items(
    Joi.object({
      forestId: Joi.number().integer().positive().required(),
      stock: Joi.number().integer().positive().required(),
    })
  ).optional()
});

// JOI - userShema
export const userSchema = Joi.object({
  email: Joi.string()
  .email()
  .trim()
  .lowercase()
  .required()
  .messages({
    'string.email': 'Email invalide',
    'string.empty': 'Email requis',
    'any.required': 'Email requis',
  }),
  password: Joi.string()
  .min(8)
  .required()
  .messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'string.empty': 'Mot de passe requis',
    'any.required': 'Mot de passe requis',
  }),
  role: Joi.string(),
  firstname: Joi.string().optional().allow(''),
  lastname: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  city: Joi.string().optional().allow(''),
  zipcode: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
});

// JOI - userUpdateSchema
export const userUpdateSchema = Joi.object({
  firstname: Joi.string().trim().max(255).optional(),
  lastname: Joi.string().trim().max(255).optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  phone: Joi.string().trim().max(50).optional(),
  address: Joi.string().trim().max(255).optional(),
  zipcode: Joi.string().trim().max(20).optional(),
  city: Joi.string().trim().max(100).optional(),
  password: Joi.string().min(8).trim().optional(),
});

// JOI - userUpdateSchema
export const userUpdateSchemaBackOffice = Joi.object({
  firstname: Joi.string().trim().max(255).optional(),
  lastname: Joi.string().trim().max(255).optional(),
  email: Joi.string().email().trim().lowercase(),
  role: Joi.string().valid('admin', 'user'),
  // on interdit le champ password
  password: Joi.forbidden().messages({
    'any.unknown': 'Le mot de passe ne peut pas être modifié ici.',
  }),
}).unknown(true); // Autorise les champs non définis
