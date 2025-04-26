import axios from "axios";
import { Forest, ForestWithTreesAndStock } from "../types/index";
import { createAxiosWithAuth } from "../utils/axiosInstance";
import { Request } from "express";

const BASE_URL = process.env.API_BASE_URL;
const api_url = BASE_URL + '/forests';

export const getAll = async (limit=9, offset=0): Promise<{ forests: Forest[]; total: number }> => {
  const response = await axios.get(`${api_url}/with-count?limit=${limit}&offset=${offset}`);

  const data = response.data;
  return data;
};

export const getAllWithoutCount = async (limit=9, offset=0): Promise<{ forests: Forest[]; total: number }> => {
  const response = await axios.get(`${api_url}?limit=${limit}&offset=${offset}`);

  const data = response.data;
  return data;
};

export const getOne = async (id: string): Promise<Forest> => {
  const response = await axios.get(`${api_url}/${id}`);

  const data = response.data;
  return data;
};

export const getForestWithTreesAndStock = async (id: string): Promise<ForestWithTreesAndStock> => {
  const response = await axios.get(`${api_url}/${id}/trees-with-stock`);

  const data = response.data;
  return data;
};

export const add = async (req: Request, forest: Forest): Promise<ForestWithTreesAndStock> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.post(`${api_url}`, forest);

  const data = response.data;
  return data;
};

export const update = async (req: Request, id: number, forest: Forest): Promise<ForestWithTreesAndStock> => {
  const axiosInstance = createAxiosWithAuth(req);
  const response = await axiosInstance.patch(`${api_url}/${id}`, forest);

  const data = response.data;
  return data;
};

export const remove = async (req: Request, id: number): Promise<void> => {
  const axiosInstance = createAxiosWithAuth(req);
  await axiosInstance.delete(`${api_url}/${id}`);
};