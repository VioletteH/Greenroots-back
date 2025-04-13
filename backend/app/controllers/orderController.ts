
import { Request, Response } from 'express';

const orderController = {   
    orders: (req:Request, res:Response) => {
        res.send(" → Récupérer toutes les commandes");
    },
    orderById: (req:Request, res:Response) => {
        res.send("→ Récupérer une commande par son ID");
    },
    addOrder: (req:Request, res:Response) => {
        res.send("→ Ajouter une commande");
    },
    updateOrder: (req:Request, res:Response) => {
        res.send("→ Mettre à jour une commande");
    },
}
export default orderController;