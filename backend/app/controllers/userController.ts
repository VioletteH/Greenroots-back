import { NextFunction, Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { User } from '../types/index';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { userSchema } from '../utils/shemasJoi';

const userMapper = new BaseMapper<User>('user');

const userController = {   

    users: catchAsync(async (req:Request, res:Response ) => {
        const users = await userMapper.findAll();
        if (users.length === 0) {
            res.status(200).json("No users found");
        }
        res.status(200).json(users);
    }),
    userById: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Validation
        const { error, value } = userSchema.validate({ id });
        if (error) {
            return next(new AppError("Invalid data", 400));
        }
        // User exist
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
            return next(new AppError("Invalid data", 400));
        }
        // User exist
        const existingUser = await userMapper.findById(value.id);
        if (existingUser) {
            return next(new AppError(`User with ${value.id} already exists`, 400));
        }
        // Create new user
        const newUser = await userMapper.create(value);
        res.status(201).json(newUser);
    }),
    updateUser: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Validation
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }
        // User exist
        const existingUser = await userMapper.findById(id);
        if (!existingUser) {
            return next(new AppError(`User with ${id} not found`, 404));
        }
        // Update user
        const updatedUser = await userMapper.update(id, value);
        res.status(200).json(updatedUser);
    }),
    deleteUser: catchAsync(async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        // User exist
        const existingUser = await userMapper.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const deletedUser = await userMapper.delete(id);
        res.status(200).send("User deleted");
    }),
}
export default userController;