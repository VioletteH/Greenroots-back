import { sanitizeInput } from '../utils/sanitizeInput';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { forestSchema } from '../utils/shemasJoi';
import loadForestMapper from '../mappers/forestMapper';
import { Forest } from '../types/index';

const forestMapper = new loadForestMapper();

const forestController = {   

    // ALL FORESTS

    forests: catchAsync(async (req: Request, res: Response, next:NextFunction ): Promise<void | Response>  => {
        
        // Query parameters
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const withCount = req.query.withCount === 'true';

        let forests: Forest[] = [];
        let total: number | undefined;
        
        // Check if sortBy or withCount are defined
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

        // Send data
        if (withCount) {
            return res.status(200).json({ forests, total });
        }
        res.status(200).json(forests);
    }),

    // ONE FOREST

    forestById: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        
        const id = parseInt(req.params.id, 10);
        
        const forest = await forestMapper.findById(id);
        if (!forest) {
            return next(new AppError(`Forest with ${id} not found`, 404));
        }
        
        res.status(200).json(forest);
    }),

    forestWithTreesAndStock: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        
        const id = parseInt(req.params.id, 10);
        
        const forest = await forestMapper.forestWithTreesAndStock(id);
        if (!forest) {
            return next(new AppError(`Forest with ${id} not found`, 404));
        }
        
        res.status(200).json(forest);
    }),

    // ASSOCIATION

    forestsByTree: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        
        const id = parseInt(req.params.id, 10);
        
        const forests = await forestMapper.forestsByTree(id);
        if (forests.length === 0) {
            return next(new AppError(`No forests found for tree with id ${id}`, 404));
        }

        res.status(200).json(forests);
    }),

    // POST, PATCH & DELETE

    addForest: catchAsync(async (req:Request, res:Response, next: NextFunction ) => {
        
        const sanitizedBody = sanitizeInput(req.body);
        sanitizedBody.treeAssociations = Object.values(sanitizedBody.treeAssociations);

        const { error, value } = forestSchema.validate(sanitizedBody);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }

        // Extraction of `treeAssociations` from `value` and assignment of the other properties of `value` to `forestData`.
        const { treeAssociations, ...forestData } = value;

        const newForest = await forestMapper.create(forestData);

        // If `treeAssociations` is not empty and is an array, we associate the new forest with the specified trees.
        if (treeAssociations.length > 0 && Array.isArray(treeAssociations)) {
            await forestMapper.addForestToTrees(newForest.id, treeAssociations);
        }

        res.status(201).json(newForest);
    }),

    updateForest: catchAsync(async (req:Request, res:Response, next: NextFunction )  => {
        
        const id = parseInt(req.params.id, 10);
        const sanitizedBody = sanitizeInput(req.body);
        sanitizedBody.treeAssociations = Object.values(sanitizedBody.treeAssociations);

        const { error, value } = forestSchema.validate(sanitizedBody);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }

        let { treeAssociations, ...forestData } = value;

        const tree = await forestMapper.findById(id);
        if (!tree) {
            return res.status(404).json({ message: "Forest not found" });
        }

        // If `treeAssociations` is an object, we convert it to an array
        if (treeAssociations && typeof treeAssociations === 'object') {
            treeAssociations = Object.values(treeAssociations);
        }
    
        const updatedForest = await forestMapper.update(id, forestData);
        
        if (treeAssociations && treeAssociations.length > 0) {
            await forestMapper.updateForestToTrees(id, treeAssociations);
        }

        res.status(200).json(updatedForest);
    }),
    
    deleteForest: catchAsync (async (req:Request, res:Response) => {
        
        const id = parseInt(req.params.id, 10);

        const forest = await forestMapper.findById(id);
        if (!forest) {
            return res.status(404).json({ message: "Forest not found" });
        }
        
        await forestMapper.delete(id);

        res.status(200).send("Forest deleted");
    }),

}

export default forestController;