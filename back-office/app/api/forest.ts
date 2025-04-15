import axios from "axios";
import { Forest } from "../types/index";

const api_url = "http://greenroots-backend:3000";

export const getAll = async (): Promise<Forest[]> => {
  const response = await axios.get(`${api_url}/forests`);

  const data = response.data;
  return data;
};