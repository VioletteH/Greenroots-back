import axios from "axios";
import { Forest } from "../types/index";
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

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

export const add = async (req: Request, forest: Forest): Promise<Forest> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.post(`${api_url}/forests`, forest);


  const data = response.data;
  return data;
};

export const update = async (req: Request, id: number, forest: Forest): Promise<Forest> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.patch(`${api_url}/forests/${id}`, forest);

  const data = response.data;
  return data;
};

export const remove = async (req: Request, id: number): Promise<void> => {
  const axiosInstance = createAxiosWithAuth(req);
  await axiosInstance.delete(`${api_url}/forests/${id}`);
};