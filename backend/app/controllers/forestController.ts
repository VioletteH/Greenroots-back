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

        const { data: forests, total } = await forestMapper.findAllWithCount(limit, offset);

        if (forests.length === 0) {
            res.json("No forests found");
        }
        res.status(200).json({
            forests,
            total,
        });
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
    getForestWithTreesAndStock: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const forest = await forestMapper.getForestWithTreesAndStock(id);
        if (!forest) {
            return next(new AppError(`Forest with ${id} not found`, 404));
        }
        res.status(200).json(forest);
    }),
    addForest: catchAsync(async (req:Request, res:Response, next: NextFunction ) => {
        const { error, value } = forestSchema.validate(req.body);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }

        const { treeAssociations, ...forestData } = value;

        const newForest = await forestMapper.create(forestData);

        if (treeAssociations.length > 0 && Array.isArray(treeAssociations)) {
            await forestMapper.addForestToTrees(newForest.id, treeAssociations);
        }

        res.status(201).json(newForest);
    }),
    updateForest: catchAsync(async (req:Request, res:Response, next: NextFunction )  => {
        const id = parseInt(req.params.id, 10);

        const { error, value } = forestSchema.validate(req.body);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }

        const { treeAssociations, ...forestData } = value;

        const existingForest = await forestMapper.findById(id);
        if (!existingForest) {
            return res.status(404).json({ message: "Forest not found" });
        }

        const updatedForest = await forestMapper.update(id, forestData);

        if (treeAssociations && Array.isArray(treeAssociations)) {
            await forestMapper.updateForestToTrees(id, treeAssociations);
        }

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