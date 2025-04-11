
import { Request, Response } from 'express';

const treeController = {   
    trees: (req:Request, res:Response) => {
        res.send(" → Récupérer toutes les arbres");
    },
    treesById: (req:Request, res:Response) => {
        res.send("→ Récupérer un arbre par son ID");
    },
    addTree: (req:Request, res:Response) => {
        res.send("→ Ajouter un arbre");
    },
    updateTree: (req:Request, res:Response) => {
        res.send("→ Mettre à jour un arbre");
    },
    deleteTree: (req:Request, res:Response) => {
        res.send("→ Supprimer un arbre");
    }
}
export default treeController;