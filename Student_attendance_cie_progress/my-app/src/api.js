import axios from "axios";

// ✅ Base URL should be your Django backend API
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});

export default API;