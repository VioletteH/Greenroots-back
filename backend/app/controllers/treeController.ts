import { NextFunction, Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Tree } from '../types/index';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { treeSchema } from '../utils/shemasJoi';
import loadTreeMapper from '../mappers/treeMapper';
import { unslugify } from '../utils/unslugify';

const treeMapper = new loadTreeMapper();

const treeController = {   
    trees: catchAsync(async (req:Request, res:Response) => {
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const offset = parseInt(req.query.offset as string, 10) || 0; 
            const trees = await treeMapper.findAll(limit, offset);
            if (trees.length === 0) {
                res.status(200).json("trees not found");
            }
            res.status(200).json(trees);
        }),
    treeById: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Tree exist
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }
        res.status(200).json(existingTree);

    }),
    treesByForest: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Tree exist
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }
        const trees = await treeMapper.treeByForest(id);
        if (trees.length === 0) {
            return next(new AppError(`No trees found for forest with id ${id}`, 404));
        }
        res.status(200).json(trees);
    }),
    treesByCountry: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const slug = req.params.slug;

        const trees = await treeMapper.treeByCountry(slug);
        if (trees.length === 0) {
            return next(new AppError(`No trees found for slug ${slug}`, 404));
        }
        res.status(200).json(trees);
    }),
    treesByCategory: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const slug = req.params.slug;

        const trees = await treeMapper.treeByCategory(slug);
        if (trees.length === 0) {
            return next(new AppError(`No trees found for slug ${slug}`, 404));
        }
        res.status(200).json(trees);
    }),
    getTreeWithForestsAndStock: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);

        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }

        const trees = await treeMapper.getTreeWithForestsAndStock(id);

        res.status(200).json(trees);
    }),
    addTree: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const { error, value } = treeSchema.validate(req.body);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }
        
        const { forestAssociations, ...treeData } = value;

        const newTree = await treeMapper.create(treeData);

        if (forestAssociations && Array.isArray(forestAssociations)) {
            await treeMapper.addTreeToForests(newTree.id, forestAssociations);
        }

        res.status(201).json(newTree);
    }),
    updateTree: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Validation
        const { error, value } = treeSchema.validate(req.body);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }
        // Tree exist
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }
        // Update tree
        const updatedTree = await treeMapper.update(id, value);
        res.status(200).json(updatedTree);
    }),
    deleteTree: catchAsync(async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        // Tree exist
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return res.status(404).json({ message: "Tree not found" });
        }
        // Delete tree
        const deletedTree = await treeMapper.delete(id);
        res.status(200).json(deletedTree);
    })
}
export default treeController;