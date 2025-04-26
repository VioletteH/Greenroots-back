import { Order } from '../types/index';
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

const BASE_URL = process.env.API_BASE_URL;
const api_url = BASE_URL + '/orders';

export const getAll = async (req: Request, limit=9, offset=0): Promise<{orders: Order[]; total: number }> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.get(`${api_url}/with-count?limit=${limit}&offset=${offset}`);
    return response.data; 
};
export const getOne = async (req: Request, id: string): Promise<Order> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.get(`${api_url}/${id}/with-user`);  
    return response.data; 
};

export const update = async (req: Request, id: number, order: Partial<Order>): Promise<Order> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.patch(`${api_url}/${id}`, order);  
    return response.data; 
};