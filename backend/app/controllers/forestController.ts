import { Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Forest } from '../types/index';


const forestMapper = new BaseMapper<Forest>('forest');

const forestController = {   

    forests: async (req:Request, res:Response) => {
        const forests = await forestMapper.findAll();
        res.json(forests);
    },
    forestById: (req:Request, res:Response) => {
        res.send("→ Récupérer une forêt par son ID");
    },
    addTree: (req:Request, res:Response) => {
        res.send("→ Ajouter une fôret");
    },
    updateTree: (req:Request, res:Response) => {
        res.send("→ Mettre à jour une forêt");
    }
    ,
    deleteTree: (req:Request, res:Response) => {
        res.send("→ Supprimer une forêt");
    }
}
export default forestController;