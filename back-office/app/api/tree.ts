import axios from 'axios';
import { Forest, Tree, TreeWithAssociations } from '../types/index';
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

const api_url = 'http://greenroots-backend:3000/trees';

export const getAll = async (): Promise<Tree[]> => {
    const response = await axios.get(`${api_url}?limit=20`);
    return response.data; 
};

export const getOne = async (id: string): Promise<Tree> => {
    const response = await axios.get(`${api_url}/${id}`);  
    const data = response.data;
    return data;
};

export const getTreeWithForestsAndStock = async (id: string): Promise<Forest[]> => {
    const response = await axios.get(`${api_url}/${id}/forests-with-stock`);  
    const data = response.data;
    return data;
};

export const updateTree = async (id:string, updatedData: Partial<Tree>): Promise<Tree> => {
    const response = await axios.patch(`${api_url}/${id}`, updatedData);
    return response.data; 
};

export const remove = async (req: Request, id: number): Promise<void> => {
    const axiosInstance = createAxiosWithAuth(req);
    await axiosInstance.delete(`${api_url}/${id}`);
};

export const add = async (req: Request, tree: Tree): Promise<TreeWithAssociations> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.post(`${api_url}`, tree);
    return response.data;
};

export const update = async (req: Request, id: number, tree: Tree): Promise<Tree> => {
    const axiosInstance = createAxiosWithAuth(req);
    const response = await axiosInstance.patch(`${api_url}/${id}`, tree);  
    const data = response.data;
    return data;
};
