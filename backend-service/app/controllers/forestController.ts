
import { Request, Response } from 'express';

const treeController = {   
    forests: (req:Request, res:Response) => {
        res.send(" → Récupérer toutes les forêts");
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
export default treeController;