//import fetch from 'node-fetch';
import axios from 'axios';
import { Tree } from '../types/index';

const api_url = 'http://greenroots-backend:3000';

export const getAllTrees = async (): Promise<Tree[]> => {
    const response = await axios.get(`${api_url}/trees`);
    return response.data; 
};

export const updateTree = async (id:string, updatedData: Partial<Tree>): Promise<Tree> => {
    const response = await axios.put(`${api_url}/tree/${id}`, updatedData);
    return response.data; 
};
