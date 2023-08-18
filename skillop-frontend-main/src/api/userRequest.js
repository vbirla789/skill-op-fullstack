import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

export const getUser = () =>
  API.get(`/api/user/profile/me`, { withCredentials: true });

export const findUser = (id) =>
  API.get(`/api/user/profile/${id}`, { withCredentials: true });

export const loginUser = (data) =>
  API.post(`/api/user/login`, data, { withCredentials: true });
