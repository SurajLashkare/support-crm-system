import axios from "axios";

const API = axios.create({
  baseURL: "https://support-crm-system-qt25.onrender.com",
});

export default API;