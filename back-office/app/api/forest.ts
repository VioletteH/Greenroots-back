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

<<<<<<< HEAD
export const add = async (forest: Forest): Promise<Forest> => {
  const response = await axios.post(`${api_url}`, forest);
=======
export const add = async (req: Request, forest: Forest): Promise<Forest> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.post(`${api_url}/forests`, forest);
>>>>>>> c800e65d4180cced81fe7ae07610bf936161061c

  const data = response.data;
  return data;
};

<<<<<<< HEAD
export const update = async (id: number, forest: Forest): Promise<Forest> => {
  const response = await axios.patch(`${api_url}/${id}`, forest);
=======
export const update = async (req: Request, id: number, forest: Forest): Promise<Forest> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.patch(`${api_url}/forests/${id}`, forest);
>>>>>>> c800e65d4180cced81fe7ae07610bf936161061c

  const data = response.data;
  return data;
};

<<<<<<< HEAD
export const remove = async (id: number): Promise<void> => {
  await axios.delete(`${api_url}/${id}`);
=======
export const remove = async (req: Request, id: number): Promise<void> => {
  const axiosInstance = createAxiosWithAuth(req);
  await axiosInstance.delete(`${api_url}/forests/${id}`);
>>>>>>> c800e65d4180cced81fe7ae07610bf936161061c
};