import axios from "axios";
import { API_URL } from "@/constants/config";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
