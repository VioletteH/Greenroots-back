import { Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Tree } from '../types/index';

const treeMapper = new BaseMapper<Tree>('tree');

const treeController = {   
    trees: async (req:Request, res:Response) => {
            const trees = await treeMapper.findAll();
            res.json(trees);
        },
    treeById: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const tree = await treeMapper.findById(id);
        if (tree) {
            res.json(tree);
        } else {
            res.status(404).send(`Arbre avec l'ID ${id} non trouvé`);
        }
    },
    addTree: async (req:Request, res:Response) => {
        const newTreeData = req.body; 
        const newTree = await treeMapper.create(newTreeData);
        res.status(201).json(newTree);
    },
    updateTree: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const updatedTreeData = req.body; 
        const updatedTree = await treeMapper.update(id, updatedTreeData);
        res.json(updatedTree);
    }
    ,
    deleteTree: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const deletedTree = await treeMapper.delete(id);
        res.send("Arbre supprimé");
    }
}
export default treeController;