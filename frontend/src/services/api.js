import axios from "axios";

const api = axios.create({
  baseURL: "https://visitor-pass-management-quhw.onrender.com/api",
});

export default api;