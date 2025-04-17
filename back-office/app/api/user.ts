import axios from "axios";
import { User } from "../types/index";
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

const api_url = "http://greenroots-backend:3000/users";

export const getAll = async (req: Request): Promise<User[]> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.get(`${api_url}?limit=15&offset=0`);

  const data = response.data;
  return data;
};

export const getOne = async (req: Request, id: string): Promise<User> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.get(`${api_url}/${id}`);

  const data = response.data;
  return data;
};

export const add = async (req: Request, user: User): Promise<User> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.post(`${api_url}`, user);

  const data = response.data;
  return data;
};

export const update = async (req: Request, id: number, user: Partial<User>): Promise<User> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.patch(`${api_url}/${id}/backoffice`, user);

  const data = response.data;
  return data;
};

export const remove = async (id: number): Promise<void> => {
  await axios.delete(`${api_url}/${id}`);
};