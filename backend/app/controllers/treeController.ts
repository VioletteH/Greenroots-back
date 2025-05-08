import { NextFunction, Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Tree } from '../types/index';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { treeSchema } from '../utils/shemasJoi';
import loadTreeMapper from '../mappers/treeMapper';
import { unslugify } from '../utils/unslugify';
import { limits } from 'argon2';
import { sanitizeInput } from '../utils/sanitizeInput';

const treeMapper = new loadTreeMapper();

const treeController = { 

    // all trees

    trees: catchAsync(async (req:Request, res:Response, next: NextFunction) => {

        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0; 
        const sortBy = req.query.sortBy as string;
        const withCount = req.query.withCount === 'true';

        let trees: Tree[] = [];
        let total: number | undefined;

        if (sortBy === 'price') {
            trees = await treeMapper.treesByPrice();
        }else if (withCount) {
            const result = await treeMapper.findAllWithCount(limit, offset);
            trees = result.data;
            total = result.total;
        }else {
            trees = await treeMapper.findAll(limit, offset); 
        }

        if (!trees || trees.length === 0) {
            return next(new AppError("No trees found", 404)); 
        }

        if (withCount) {
            return res.status(200).json({ trees, total });
        }
        
        res.status(200).json(trees);
    }),

    treesWithForests: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const trees = await treeMapper.treesWithForests(limit, offset);
        if (!trees || trees.length === 0) {
            return next(new AppError("No trees found", 404));
        }
        res.status(200).json(trees);
    }),    

    // one tree

    treeById: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Tree exist
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }
        res.status(200).json(existingTree);

    }),

    treeWithForestsAndStock: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);

        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }

        const trees = await treeMapper.treeWithForestsAndStock(id);

        res.status(200).json(trees);
    }),

    // association & filtres

    treesByForest: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        // Tree exist
        const existingTree = await treeMapper.findById(id);
        if (!existingTree) {
            return next(new AppError(`Tree with ${id} not found`, 404));
        }
        const trees = await treeMapper.treesByForest(id);
        if (trees.length === 0) {
            return next(new AppError(`No trees found for forest with id ${id}`, 404));
        }
        res.status(200).json(trees);
    }),

    treesByCountry: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const slug = req.params.slug;

        const trees = await treeMapper.treesByCountry(slug);
        if (trees.length === 0) {
            return next(new AppError(`No trees found for slug ${slug}`, 404));
        }
        res.status(200).json(trees);
    }),
    
    treesByCategory: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        const slug = req.params.slug;

        const trees = await treeMapper.treesByCategory(slug);
        if (trees.length === 0) {
            return next(new AppError(`No trees found for slug ${slug}`, 404));
        }
        res.status(200).json(trees);
    }),

    // post, patch et delete

    addTree: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
        // const sanitizedBody = sanitizeInput(req.body);
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
        // const sanitizedBody = sanitizeInput(req.body);
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
        res.status(200).send("Tree deleted");
    }),

    // treesWithCount: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
    //     const limit = parseInt(req.query.limit as string, 10) || 10;
    //     const offset = parseInt(req.query.offset as string, 10) || 0; 
    //     const { data: trees, total } = await treeMapper.findAllWithCount(limit, offset);
    //     if (!trees || trees.length === 0) {
    //         return next(new AppError("No trees found", 404)); 
    //     }
    //     res.status(200).json({
    //         trees,
    //         total,
    //     });
    // }),

    // treeWithForests: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
    //     const id = parseInt(req.params.id, 10);
    //     const tree = await treeMapper.treeWithForests(id);
    //     if (!tree || tree.length === 0) {
    //         return next(new AppError("No trees found", 404));
    //     }
    //     res.status(200).json(tree);
    // }),

    // getCustomTrees: catchAsync(async (req:Request, res:Response, next: NextFunction) => {
    //     const { ids } = req.query;
    //     let idsArray: number[] = [];
    //     if (Array.isArray(ids)) {
    //         idsArray = ids.map(Number).filter(id => !isNaN(id));
    //     } else if (typeof ids === 'string') {
    //         // Si un seul id envoyé sous forme de string (ex: ?ids=5)
    //         idsArray = ids.split(',').map(Number).filter(id => !isNaN(id));
    //     }
    //     if (idsArray.length === 0) {
    //         return res.status(400).json({ error: "Paramètre 'ids' requis sous forme de liste d'entiers." });
    //     }
    //     const trees = await treeMapper.getCustomTreeWithForests(idsArray);       
    //     res.status(200).json(trees);
    // }),


}
export default treeController;