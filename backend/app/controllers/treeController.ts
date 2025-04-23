import { NextFunction, Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Tree } from '../types/index';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { treeSchema } from '../utils/shemasJoi';
import loadTreeMapper from '../mappers/treeMapper';
import { unslugify } from '../utils/unslugify';
import { limits } from 'argon2';

const treeMapper = new loadTreeMapper();

const treeController = {   
    trees: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0; 
        const sortBy = req.query.sortBy as string;
        let trees;

        if (sortBy === 'price') {
            trees = await treeMapper.treeByPrice();
        } else {
            trees = await treeMapper.findAll(limit, offset); 
        }
    
        if (!trees || trees.length === 0) {
            return next(new AppError("No trees found", 404)); 
        }
        // const trees = await treeMapper.findAll(limit, offset);
        // if (trees.length === 0) {
        //     res.status(200).json("trees not found");
        // }
        res.status(200).json(trees);
    }),
    allTreesWithForests: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const trees = await treeMapper.getAllTreesWithForests(limit, offset);
        if (!trees || trees.length === 0) {
            return next(new AppError("No trees found", 404));
        }
        res.status(200).json(trees);
    }),    
    oneTreeWithForests: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const tree = await treeMapper.getOneTreeWithForests(id);
        if (!tree || tree.length === 0) {
            return next(new AppError("No trees found", 404));
        }
        res.status(200).json(tree);
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
        
        // On extrait `forestAssociations` de `value` et on assigne les autres propriétés du `value` à `treeData`.
        // Cela permet de séparer les associations de forêts des autres données de l'arbre.
        const { forestAssociations, ...treeData } = value;

        const newTree = await treeMapper.create(treeData);

        // Vérification si des associations de forêts ont été envoyées (si `forestAssociations` n'est pas vide et est un tableau).
        // Si c'est le cas, on associe le nouvel arbre aux forêts spécifiées.
        if (forestAssociations.length > 0 && Array.isArray(forestAssociations)) {
            await treeMapper.addTreeToForests(newTree.id, forestAssociations);
        }

        res.status(201).json(newTree);
    }),
    updateTree: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);

        const { error, value } = treeSchema.validate(req.body);
        if (error) {
            return next(new AppError("Invalid data", 400));
        }

        // On extrait `forestAssociations` de `value` et on assigne les autres propriétés du `value` à `treeData`.
        const { forestAssociations, ...treeData } = value;

        // Vérifie si l’arbre avec l’ID fourni existe en base de données.
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }

        const updatedTree = await treeMapper.update(id, treeData);

        // Vérifie si des associations de forêts ont été envoyées (si `forestAssociations` n'est pas vide et est un tableau).
        // Si c'est le cas, on met à jour les associations de forêts pour l'arbre spécifié.
        if (forestAssociations && Array.isArray(forestAssociations)) {
            await treeMapper.updateTreeToForests(id, forestAssociations);
        }
        
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