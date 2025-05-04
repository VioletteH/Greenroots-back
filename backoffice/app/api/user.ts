import axios from "axios";
import { User } from "../types/index";
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

const BASE_URL = process.env.API_BASE_URL;
const api_url = BASE_URL + '/users';

// export const getAll = async (req: Request, limit=9, offset=0): Promise<{ users: User[]; total: number }> => {
//   const axiosInstance = createAxiosWithAuth(req);
//   const response = await axiosInstance.get(`${api_url}/with-count?limit=${limit}&offset=${offset}`);

//   const data = response.data;
//   return data;
// };

export const getAll = async (req: Request, limit = 9, offset = 0, withCount = true): Promise<{ users: User[]; total?: number }> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.get(`${api_url}?limit=${limit}&offset=${offset}${withCount ? '&withCount=true' : ''}`);
  return response.data;
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