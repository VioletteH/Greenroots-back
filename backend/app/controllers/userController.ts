import { NextFunction, Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import AuthMapper from '../mappers/authMapper';
import { User } from '../types/index';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { userSchema, userUpdateSchema, userUpdateSchemaBackOffice } from '../utils/shemasJoi';
import argon2 from 'argon2';

const userMapper = new BaseMapper<User>('user');
const userAuthMapper = new AuthMapper();

const userController = {   

    users: catchAsync(async (req:Request, res:Response ) => {
        const users = await userMapper.findAll();
        if (users.length === 0) {
            res.status(200).json("No users found");
        }
        res.status(200).json(users);
    }),

    userById: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        // Check user id
        const id = parseInt(req.params.id, 10);

        // Check if user exists
        const existingUser = await userMapper.findById(id);
        if (!existingUser) {
            return next(new AppError(`User with ${id} not found`, 404));
        }

        // Get user
        res.status(200).json(existingUser);
    }),

    addUser: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        // Validation
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            const messages = error.details.map(detail => detail.message);
            console.log(messages);
            return next(new AppError(messages.join(', '), 400));
        }
        // Check if user already exists
        const user = await userAuthMapper.findByEmail(value.email) as User; 
        if (user) {
            return next(new AppError ("User already exists", 400));
        }

        // Password hashing
        const hashedPassword = await argon2.hash(value.password);

        // Set role admin
        value.role = "admin";

        // Create new user
        const newUser = await userMapper.create({ ...value, password: hashedPassword });
        res.status(201).json(newUser);
    }),

    updateUser: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        // Check user id
        const id = parseInt(req.params.id, 10);

        // Validation
        const { error, value } = userUpdateSchema.validate(req.body);
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return next(new AppError(messages.join(', '), 400));
        }
    
        // User exist
        const existingUser = await userMapper.findById(id);
        if (!existingUser) {
            return next(new AppError(`User with ${id} not found`, 404));
        }
        //  agron2
        if (value.password) {
            const hashedPassword = await argon2.hash(value.password);
            value.password = hashedPassword;
        }

        // Update user
        const updatedUser = await userMapper.update(id, value);
        res.status(200).json(updatedUser);
    }),

    deleteUser: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        // Check user id
        const id = parseInt(req.params.id, 10);

        // User exist
        const existingUser = await userMapper.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await userMapper.delete(id);
        res.status(200).send("User deleted");
    }),
    updateUserBackOffice: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Validation
        const { error, value } = userUpdateSchemaBackOffice.validate(req.body);
        if (error) {
            return next(new AppError("Invalid update data", 400));
        }

        // User exist?
        const user = await userMapper.findById(Number(req.params.id));
        if (!user) {
            return next(new AppError("Utilisateur introuvable", 404));
        }

        // Update user
        const updatedUser = await userMapper.update(id, value);
        res.status(200).json(updatedUser);
    })
}
export default userController;