//import fetch from 'node-fetch';
import axios from 'axios';
import { Tree } from '../types/index';

const api_url = 'http://greenroots-backend:3000';

export const getAllTrees = async (): Promise<Tree[]> => {
    const response = await axios.get(`${api_url}/trees`);
    return response.data; 
};

export const updateTree = async (id:string, updatedData: Partial<Tree>): Promise<Tree> => {
    const response = await axios.patch(`${api_url}/trees/${id}`, updatedData);
    return response.data; 
};

export const deleteTree = async (id: string): Promise<void> => {
    await axios.delete(`${api_url}/trees/${id}`);
};

export const addTree = async (newTreeData: Partial<Tree>): Promise<Tree> => {
    const response = await axios.post(`${api_url}/trees`, newTreeData);
    return response.data;
};
