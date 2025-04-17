import axios from "axios";
import * as cookieLib from "cookie";
import { Request } from "express";

const API_URL = "http://greenroots-backend:3000"

export function createAxiosWithAuth(req: Request) {
  const cookies = cookieLib.parse(req.headers.cookie || "");
  const token = cookies.token;

  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
