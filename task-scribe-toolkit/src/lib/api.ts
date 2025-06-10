import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3500/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Tasks APIs
export const tasksApi = {
  getTasks: async () => {
    const response = await api.get("/tasks");
    return response.data;
  },
  createTask: async (data: {
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },
  updateTask: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
      dueDate?: string;
    }
  ) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
