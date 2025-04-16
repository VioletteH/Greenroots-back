import axios from "axios";
import { Forest } from "../types/index";

const api_url = "http://greenroots-backend:3000";

export const getAll = async (): Promise<Forest[]> => {
  const response = await axios.get(`${api_url}/forests`);

  const data = response.data;
  return data;
};

export const getOne = async (id: string): Promise<Forest> => {
  const response = await axios.get(`${api_url}/forests/${id}`);

  const data = response.data;
  return data;
};

export const add = async (forest: Forest): Promise<Forest> => {
  const response = await axios.post(`${api_url}/forests`, forest);

  const data = response.data;
  return data;
};

export const update = async (id: number, forest: Forest): Promise<Forest> => {
  const response = await axios.patch(`${api_url}/forests/${id}`, forest);

  const data = response.data;
  return data;
};