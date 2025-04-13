
import { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../utils/shemasJoi';
import AuthMapper from '../mappers/authMapper';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/errorHandler';



import type { User} from '../types/index';


const JWT_SECRET = process.env.JWT_SECRET as string;
const userMapper = new AuthMapper();

const authController = {   
    
    login: async (req: Request, res: Response, next:NextFunction ): Promise<void>  => {
        try {
            //step 1 - data validation
            console.log("🧪 Étape 1 - Validation Joi");
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                next(new AppError ("Password or email - invalid1", 400));
            }

            //step 2 - find user
            const user = await userMapper.findByEmail(value.email) as User;
            if (!user) {
                next(new AppError ("Password or email - invalid2", 400));
            }

            //step 3 - password verification
            const passwordValid = await argon2.verify(user.password, value.password);
            if (!passwordValid) {
                next(new AppError ("Password or email - invalid3", 400));
            }

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
        } catch (err) {
            next(new AppError ("Server error during login.", 500));
        }
    },
    register: (req:Request, res:Response) => {
        res.send("Register Page");
    }
}
export default authController;