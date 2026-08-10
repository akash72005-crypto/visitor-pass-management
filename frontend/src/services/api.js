import axios from "axios";

const api = axios.create({
  baseURL: "https://visitor-pass-backend-meu4.onrender.com/api",
});

export default api;