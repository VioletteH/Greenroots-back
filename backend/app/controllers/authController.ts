
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

import { loginSchema } from '../utils/shemasJoi';
import AuthMapper from '../mappers/authMapper';
import type { User} from '../types/index';

// Error handling
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';


const JWT_SECRET = process.env.JWT_SECRET as string;
const userMapper = new AuthMapper();

const authController = {   
    
    login: catchAsync(async (req: Request, res: Response, next:NextFunction ): Promise<void>  => {
            //step 1 - data validation
            console.log("🧪 Étape 1 - Validation Joi");
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
               return next(new AppError ("Password or email - invalid", 400));
            }

            //step 2 - find user
            const user = await userMapper.findByEmail(value.email) as User;
            if (!user) {
                return next(new AppError ("Password or email - invalid", 400));
            }

            //step 3 - password verification
            const passwordValid = await argon2.verify(user.password, value.password);
            if (!passwordValid) {
                return next(new AppError ("Password or email - invalid", 400));
            }

            //One message for all errors for security reasons 

            //step 4 - generate JWT token
            const token = jwt.sign(

                { id: user.id, role: user.role, email: user.email },
                JWT_SECRET,
                { expiresIn: '12h' }
            );
            console.log("🧪 Étape 4 - Génération du token JWT");
            res.status(200).json({
                message: 'Connexion réussie !',
                token,
                user: { id: user.id, email: user.email, role: user.role }
            });
    }),
    register: (req:Request, res:Response) => {
        res.send("Register Page");
    }
}
export default authController;