import { sanitizeInput } from '../utils/sanitizeInput';

import { NextFunction, Request, Response } from 'express';

import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { forestSchema } from '../utils/shemasJoi';

import loadForestMapper from '../mappers/forestMapper';

import { Forest } from '../types/index';

const forestMapper = new loadForestMapper();

const forestController = {   

    forests: catchAsync(async (req: Request, res: Response, next:NextFunction ): Promise<void | Response>  => {
        
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const withCount = req.query.withCount === 'true';

        let forests: Forest[] = [];
        let total: number | undefined;

        if (withCount) {
            const result = await forestMapper.findAllWithCount(limit, offset);
            forests = result.data;
            total = result.total;
        }else {
            forests = await forestMapper.findAll(limit, offset);
        }
 
        if (!forests || forests.length === 0) {
            return next(new AppError("No trees found", 404)); 
        }

        if (withCount) {
            return res.status(200).json({ forests, total });
        }

        res.status(200).json(forests);
    }),

    // forestsWithCount: catchAsync(async (req: Request, res: Response, next:NextFunction ): Promise<void>  => {
    //     const limit = parseInt(req.query.limit as string, 10) || 10;
    //     const offset = parseInt(req.query.offset as string, 10) || 0;

    //     const { data: forests, total } = await forestMapper.findAllWithCount(limit, offset);

    //     if (forests.length === 0) {
    //         res.json("No forests found");
    //     }
    //     res.status(200).json({
    //         forests,
    //         total,
    //     });
    // }),

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
        const forests = await forestMapper.forestsByTree(id);
        if (forests.length === 0) {
            return next(new AppError(`No forests found for tree with id ${id}`, 404));
        }
        console.log("forestsByTree →", forests);

        res.status(200).json(forests);
    }),

    forestWithTreesAndStock: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const forest = await forestMapper.forestWithTreesAndStock(id);
        if (!forest) {
            return next(new AppError(`Forest with ${id} not found`, 404));
        }
        res.status(200).json(forest);
    }),

    addForest: catchAsync(async (req:Request, res:Response, next: NextFunction ) => {
        // const sanitizedBody = sanitizeInput(req.body);
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
        // const sanitizedBody = sanitizeInput(req.body);
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