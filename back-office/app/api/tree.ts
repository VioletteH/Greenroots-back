//import fetch from 'node-fetch';
import axios from 'axios';
import { Tree } from '../types/index';

const api_url = 'http://greenroots-backend:3000';

export const getAllTrees = async (): Promise<Tree[]> => {
    const response = await axios.get(`${api_url}/trees`);

    const data = response.data; // Assertion de type ici
    return data;
    //return await response.json();
};
