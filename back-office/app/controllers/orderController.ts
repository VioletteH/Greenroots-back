import { Request, Response } from 'express';
import { getAll, getOne, update } from '../api/order';
import { Order } from '../types/index';
import { sanitizeObject } from "../utils/sanitize";

const statusMap: { [key: number]: string } = {
    1: 'En cours',
    2: 'Terminée',
    3: 'Annulée'
};

const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "Date inconnue";
    
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris',
    });
};

const formatOrder = (order: Order): Order & {
    createdAtFormatted: string,
    updatedAtFormatted: string,
    statusLabel: string
} => ({
    ...order,
    createdAtFormatted: formatDate(order.createdAt),
    updatedAtFormatted: formatDate(order.updatedAt),
    statusLabel: statusMap[Number(order.status)] || 'Statut inconnu'
});

const orderController = {
    getAllOrders: async (req: Request, res: Response): Promise<void> => {
        try {
            const limit = 5;
            const page = Number(req.query.page as string) || 1;
            const offset = (page - 1) * limit;

            const { orders, total } = await getAll(req, limit, offset);
            const totalPages = Math.ceil(total / limit);

            const formattedOrders = orders.map(formatOrder);   
             
            res.render('order/index', { 
                orders: formattedOrders,
                currentPage: page,
                totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1,
            });
        } catch (error) {
            console.error('Erreur dans le contrôleur:', error);
            res.status(500).send('Erreur interne');
        }
    },
    getOrder: async (req:Request, res:Response) => {
        const id = req.params.id;
        try {
            const order: Order = await getOne(req, id);
            res.render('order/show', { order: formatOrder(order) });
        } catch (error) {
            console.error('Erreur dans getOrder :', error);
            res.status(500).send('Erreur en interne');
        }
    },

    editOrderView: async (req:Request, res:Response) => {
        const id = req.params.id;
        try {
            const order = await getOne(req, id);
            res.render('order/edit', { order: formatOrder(order) });
        } catch (error) {
            console.error('Erreur dans editOrderView :', error);
            res.status(500).send('Erreur interne');
        }
    },

    updateOrder: async (req: Request, res: Response) => {
        const id = req.params.id;
        const { status } = sanitizeObject(req.body);
        try {
            await update(req, Number(id), { status: Number(status) });
            res.redirect('/orders');
        } catch (error) {
            console.error('Erreur dans le contrôleur:', error);
            res.status(500).send('Erreur interne');
        }
    },
};

export default orderController;