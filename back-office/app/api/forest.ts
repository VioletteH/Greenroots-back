import axios from "axios";
import { Forest } from "../types/index";

const api_url = "http://greenroots-backend:3000/forests";

export const getAll = async (): Promise<Forest[]> => {
  const response = await axios.get(`${api_url}?=limit=15&offset=0`);

  const data = response.data;
  return data;
};

export const getOne = async (id: string): Promise<Forest> => {
  const response = await axios.get(`${api_url}/${id}`);

  const data = response.data;
  return data;
};

export const add = async (forest: Forest): Promise<Forest> => {
  const response = await axios.post(`${api_url}`, forest);

  const data = response.data;
  return data;
};

export const update = async (id: number, forest: Forest): Promise<Forest> => {
  const response = await axios.patch(`${api_url}/${id}`, forest);

  const data = response.data;
  return data;
};

export const remove = async (id: number): Promise<void> => {
  await axios.delete(`${api_url}/${id}`);
};