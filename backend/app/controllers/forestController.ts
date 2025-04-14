import { Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Forest } from '../types/index';

const forestMapper = new BaseMapper<Forest>('forest');

const forestController = {   

    forests: async (req:Request, res:Response) => {
        const forests = await forestMapper.findAll();
        res.json(forests);
    },
    forestById: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const forest = await forestMapper.findById(id);
        if (forest) {
            res.json(forest);
        } else {
            res.status(404).send(`Forêt avec l'ID ${id} non trouvée`);
        }
    },
    addForest: async (req:Request, res:Response) => {
        const newForestData = req.body; 
        const newForest = await forestMapper.create(newForestData);
        res.status(201).json(newForest);
    },
    updateForest: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const updatedForestData = req.body; 
        const updatedForest = await forestMapper.update(id, updatedForestData);
        res.json(updatedForest);
    },
    deleteForest: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const deletedForest = await forestMapper.delete(id);
        res.send("Forêt supprimée");
    }
}
export default forestController;