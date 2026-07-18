import api from "./api.config";

export const createCrudApi = <T, CreateData = unknown, UpdateData = unknown>(endpoint: string) => ({
  getAll: async (): Promise<T[]> => {
    const response = await api.get<T[]>(endpoint);
    return response.data;
  },
  
  getById: async (id: number | string): Promise<T> => {
    const response = await api.get<T>(`${endpoint}/${id}`);
    return response.data;
  },
  
  create: async (data: CreateData): Promise<T> => {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  },
  
  update: async (id: number | string, data: UpdateData): Promise<T> => {
    const response = await api.put<T>(`${endpoint}/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`${endpoint}/${id}`);
  }
});
