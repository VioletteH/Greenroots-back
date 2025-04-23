import Joi, { optional } from 'joi';

//JOI - LoginShema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': "L'adresse e-mail doit être valide.",
      'string.empty': "L'adresse e-mail est requise.",
      'any.required': "L'adresse e-mail est requise.",
    }),

  password: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': "Le mot de passe est requis.",
      'any.required': "Le mot de passe est requis.",
    }),
});


//JOI - RegisterShema 
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': "L'adresse e-mail doit être valide.",
      'string.empty': "L'adresse e-mail est requise.",
      'any.required': "L'adresse e-mail est requise.",
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': "Le mot de passe doit contenir au moins 8 caractères.",
      'string.empty': "Le mot de passe est requis.",
      'any.required': "Le mot de passe est requis.",
    }),

  firstname: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'string.max': "Le prénom ne peut pas dépasser 255 caractères.",
      'string.empty': "Le prénom est requis.",
      'any.required': "Le prénom est requis.",
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
  location_y: Joi.number().precision(6).required(),
  treeAssociations: Joi.array().items(
    Joi.object({
      treeId: Joi.number().integer().positive().required(),
      stock: Joi.number().integer().positive().required(),
    })
  ).optional()
});

//JOI - orderShema
export const orderSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  total_price: Joi.number().precision(2).positive().required(),
  status: Joi.number().integer().required()
});

// Joi - PATCH orderSchema (pour mise à jour partielle)
export const orderUpdateSchema = Joi.object({
  user_id: Joi.number().integer().positive(),
  total_price: Joi.number().precision(2).positive(),
  status: Joi.number().integer().valid(1, 2, 3)
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

// JOI - userUpdateShema
export const userUpdateSchema = Joi.object({
  firstname: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      'string.base': 'Le prénom doit être une chaîne de caractères.',
      'string.max': 'Le prénom ne peut pas dépasser 255 caractères.',
    }),
  lastname: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      'string.base': 'Le nom doit être une chaîne de caractères.',
      'string.max': 'Le nom ne peut pas dépasser 255 caractères.',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.email': "L'adresse e-mail doit être valide.",
      'string.base': "L'adresse e-mail doit être une chaîne de caractères.",
    }),
  phone: Joi.string()
    .pattern(/^((\+33\s?|0)[1-9](\s?\d{2}){4})$/)
    .message('Le numéro de téléphone doit être au format français (ex: 06 12 34 56 78 ou +33 6 12 34 56 78).')
    .trim()
    .optional(),
  address: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      'string.base': "L'adresse doit être une chaîne de caractères.",
      'string.max': "L'adresse ne peut pas dépasser 255 caractères.",
    }),
  zipcode: Joi.string()
    .pattern(/^\d{5}$/)
    .message('Le code postal doit contenir exactement 5 chiffres.')
    .trim()
    .optional(),
  city: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.base': 'La ville doit être une chaîne de caractères.',
      'string.max': 'Le nom de la ville ne peut pas dépasser 100 caractères.',
    }),
  password: Joi.string()
    .min(8)
    .trim()
    .optional()
    .messages({
      'string.base': 'Le mot de passe doit être une chaîne de caractères.',
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
    }),
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
