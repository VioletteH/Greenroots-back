import { Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Order } from '../types/index';

const orderMapper = new BaseMapper<Order>('order');

const orderController = {   

    orders: async (req:Request, res:Response) => {
        const orders = await orderMapper.findAll();
        res.json(orders);
    },
    orderById: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const order = await orderMapper.findById(id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).send(`Commande avec l'ID ${id} non trouvée`);
        }
    },
    addOrder: async (req:Request, res:Response) => {
        const newOrderData = req.body; 
        const newOrder = await orderMapper.create(newOrderData);
        res.status(201).json(newOrder);
    },
    updateOrder: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const updatedOrderData = req.body; 
        const updatedOrder = await orderMapper.update(id, updatedOrderData);
        res.json(updatedOrder);
    }
    ,
    deleteOrder: async (req:Request, res:Response) => {
        const id = parseInt(req.params.id, 10);
        const deletedOrder = await orderMapper.delete(id);
        res.send("Commande supprimée");
    }
}
export default orderController;