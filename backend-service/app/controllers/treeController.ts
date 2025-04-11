
import { Request, Response } from 'express';

const treeController = {   
    trees: (req:Request, res:Response) => {
        res.send(" → Récupérer toutes les forêts");
    },
    treesById: (req:Request, res:Response) => {
        res.send("→ Récupérer les forêts dans lesquelles un arbre donné est présent");
    },
    addTree: (req:Request, res:Response) => {
        res.send("→ Ajouter un arbre");
    },
    updateTree: (req:Request, res:Response) => {
        res.send("→ Mettre à jour un arbre");
    }
    ,
    deleteTree: (req:Request, res:Response) => {
        res.send("→ Supprimer un arbre");
    }
}
export default treeController;