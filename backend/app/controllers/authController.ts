
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

import { loginSchema, registerSchema } from '../utils/shemasJoi';
import AuthMapper from '../mappers/authMapper';
import type { User} from '../types/index';

// Error handling
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { error } from 'console';


const JWT_SECRET = process.env.JWT_SECRET as string;
const userMapper = new AuthMapper();

const authController = {   
    
    login: catchAsync(async (req: Request, res: Response, next:NextFunction ): Promise<void>  => {
            //step 1 - data validation
            const { error, value } = loginSchema.validate(req.body);
            //TODO - SANITIZE
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
                message: 'Login ok !',
                token,
                user: { id: user.id, email: user.email, role: user.role }
            });
    }),
    register: catchAsync(async(req:Request, res:Response, next: NextFunction) : Promise<void> => {
        //step 1 - data validation
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
        
            // Extraction des messages d'erreur
            const messages = error.details.map(detail => detail.message);
            console.log(messages);
            return next(new AppError(messages.join(', '), 400));
          }
        //step 2 - find if user already exists
        const user = await userMapper.findByEmail(value.email) as User;
        if (user) {
            return next(new AppError ("User already exists", 400));
        }
        //step 3 - hash password
        const hashedPassword = await argon2.hash(value.password);
        //step 4 - create user
        const newUser = await userMapper.create({ ...value, password: hashedPassword });
        //step 5 - generate JWT token
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.status(201).json({
            message: 'register ok!',
            token,
            user: { id: newUser.id, email: newUser.email, role: newUser.role }
        });
    }),
}
export default authController;