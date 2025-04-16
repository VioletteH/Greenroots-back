import axios from 'axios';
import { Tree } from '../types/index';

const api_url = 'http://greenroots-backend:3000/trees';

export const getAll = async (): Promise<Tree[]> => {
    const response = await axios.get(`${api_url}`);
    return response.data; 
};

export const getOne = async (id: string): Promise<Tree> => {
    const response = await axios.get(`${api_url}/${id}`);
  
    const data = response.data;
    return data;
};

export const updateTree = async (id:string, updatedData: Partial<Tree>): Promise<Tree> => {
    const response = await axios.patch(`${api_url}/${id}`, updatedData);
    return response.data; 
};

export const deleteTree = async (id: string): Promise<void> => {
    await axios.delete(`${api_url}/${id}`);
};

export const addTree = async (newTreeData: Partial<Tree>): Promise<Tree> => {
    const response = await axios.post(`${api_url}`, newTreeData);
    return response.data;
};
