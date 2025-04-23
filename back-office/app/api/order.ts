import { Order } from '../types/index';
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

const api_url = 'http://greenroots-backend:3000/orders';

export const getAll = async (req: Request): Promise<Order[]> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.get(`${api_url}?limit=20`);
    return response.data; 
};
export const getOne = async (req: Request, id: string): Promise<Order> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.get(`${api_url}/${id}`);  
    return response.data; 
};

export const update = async (req: Request, id: number, order: Partial<Order>): Promise<Order> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.patch(`${api_url}/${id}`, order);  
    return response.data; 
};