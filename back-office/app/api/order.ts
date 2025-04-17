import axios from 'axios';
import { Order } from '../types/index';

const api_url = 'http://greenroots-backend:3000/orders';

export const getAll = async (): Promise<Order[]> => {
    const response = await axios.get(`${api_url}?limit=20`);
    return response.data; 
};
export const getOne = async (id: string): Promise<Order> => {
    const response = await axios.get(`${api_url}/${id}`);  
    return response.data; 
};
export const updateOrder = async (id:string, updatedData: Partial<Order>): Promise<Order> => {
    const response = await axios.patch(`${api_url}/${id}`, updatedData);
    return response.data; 
};
export const update = async (id: number, order: Order): Promise<Order> => {
    const response = await axios.patch(`${api_url}/${id}`, order);  
    return response.data; 
};