import { Request, Response } from 'express';
import { getAll, getOne, update } from '../api/order';
import { Order } from '../types/index';
import { formatDate } from '../utils/date';

const statusMap: { [key: number]: string } = {
    1: 'En cours',
    2: 'Terminée',
    3: 'Annulée'
};
const formatOrder = (order: Order): Order => ({
    ...order,
    createdAt: formatDate(order.createdAt),
    updatedAt: formatDate(order.updatedAt),
    status: statusMap[Number(order.status)] || 'Statut inconnu'
});

const orderController = {
    getAllOrders: async (req: Request, res: Response): Promise<void> => {
        try {
            const orders: Order[] = await getAll(req);
            const formattedOrders = orders.map(formatOrder);              
            res.render('order', { orders: formattedOrders });
        } catch (error) {
            console.error('Erreur dans le contrôleur:', error);
            res.status(500).send('Erreur interne');
        }
    },

    getOrder: async (req:Request, res:Response) => {
        const id = req.params.id;
        try {
            const order: Order = await getOne(req, id);
            const formattedOrder = formatOrder(order);
            res.render('order/show', { order: formattedOrder });
        } catch (error) {
            console.error('Erreur dans getOrder :', error);
            res.status(500).send('Erreur en interne');
        }
    },

    editOrderView: async (req:Request, res:Response) => {
        const id = req.params.id;
        try {
            const order = await getOne(req, id);
            const formattedOrder = formatOrder(order);
            res.render('order/edit', { order: formattedOrder });
        } catch (error) {
            console.error('Erreur dans editOrderView :', error);
            res.status(500).send('Erreur interne');
        }
    },

    updateOrder: async (req: Request, res: Response) => {
        const id = req.params.id;
        const order: Order = req.body;
        try {
            await update(Number(id), order)
            res.redirect('/order');
        } catch (error) {
            console.error('Erreur dans le contrôleur:', error);
            res.status(500).send('Erreur interne');
        }
    },
};

export default orderController;