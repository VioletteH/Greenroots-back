
import { Request, Response } from 'express';

const userController = { 
    users: (req:Request, res:Response) => {
        res.send(" → Récupérer toutes les utilisateurs");
    },
    userById: (req:Request, res:Response) => {
        res.send("→ Récupérer un utilisateur par son ID");
    },
    addUser: (req:Request, res:Response) => {
        res.send("→ Ajouter un utilisateur");
    },
    updateUser: (req:Request, res:Response) => {
        res.send("→ Mettre à jour un utilisateur");
    },
    deleteUser: (req:Request, res:Response) => {
        res.send("→ Supprimer un utilisateur");
    }  
}
export default userController;