import { NextFunction, Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Forest } from '../types/index';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { forestSchema } from '../utils/shemasJoi';
import loadForestMapper from '../mappers/forestMapper';

const forestMapper = new loadForestMapper();

const forestController = {   

    forests: catchAsync(async (req: Request, res: Response, next:NextFunction ): Promise<void>  => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const forests = await forestMapper.findAll(limit, offset);
        if (forests.length === 0) {
            res.json("No forests found");
        }
        res.status(200).json(forests);
    }),
    forestById: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const forest = await forestMapper.findById(id);
        if (!forest) {
            return next(new AppError(`Forest with ${id} not found`, 404));
        }
        res.status(200).json(forest);

    }),
    forestsByTree: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const forests = await forestMapper.forestByTree(id);
        console.log("forestByTree");
        if (forests.length === 0) {
            return next(new AppError(`No forests found for tree with id ${id}`, 404));
        }
        res.status(200).json(forests);
    }),
    addForest: catchAsync(async (req:Request, res:Response, next: NextFunction ) => {
        const newForestData = req.body;
        // Validation
        const { error, value } = forestSchema.validate(newForestData);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }
        // Forest exist
        const existingForest = await forestMapper.findById(newForestData.id);
        if (existingForest) {
            return res.status(400).json({ message: "The forest already exists" });
        }
        // Create new forest
        const newForest = await forestMapper.create(newForestData);
        res.status(201).json(newForest);
    }),
    updateForest: catchAsync(async (req:Request, res:Response, next: NextFunction )  => {
        const id = parseInt(req.params.id, 10);
        const updatedForestData = req.body; 
        // Validation
        const { error, value } = forestSchema.validate(updatedForestData);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }
        // Forest exist
        const existingForest = await forestMapper.findById(id);
        if (!existingForest) {
            return res.status(404).json({ message: "Forest not found" });
        }
        // Update forest
        const updatedForest = await forestMapper.update(id, updatedForestData);
        res.status(200).json(updatedForest);
    }),
    deleteForest: catchAsync (async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        // Forest exist
        const existingForest = await forestMapper.findById(id);
        if (!existingForest) {
            return res.status(404).json({ message: "Forest not found" });
        }
        // Delete forest
        const deletedForest = await forestMapper.delete(id);
        res.status(200).send("Forest deleted");
    }),
}
export default forestController;