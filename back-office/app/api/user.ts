import axios from "axios";
import { User } from "../types/index";

const api_url = "http://greenroots-backend:3000/users";

export const getAll = async (): Promise<User[]> => {
  const response = await axios.get(`${api_url}?=limit=15&offset=0`);

  const data = response.data;
  return data;
};

export const getOne = async (id: string): Promise<User> => {
  const response = await axios.get(`${api_url}/${id}`);

  const data = response.data;
  return data;
};

export const add = async (user: User): Promise<User> => {
  const response = await axios.post(`${api_url}`, user);

  const data = response.data;
  return data;
};

export const update = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await axios.patch(`${api_url}/${id}/backoffice`, user);

  const data = response.data;
  return data;
};

export const remove = async (id: number): Promise<void> => {
  await axios.delete(`${api_url}/${id}`);
};