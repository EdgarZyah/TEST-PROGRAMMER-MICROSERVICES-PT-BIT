import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config as any;
      if (!originalRequest._retry && originalRequest.url !== '/login') {
        originalRequest._retry = true;
        try {
          const res = await api.post('/refresh-token');
          localStorage.setItem('token', res.data.token);
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }).then((r) => r.data),
  me: () => api.get('/me').then((r) => r.data),
  refreshToken: () => api.post('/refresh-token').then((r) => r.data),
};

export const rbacApi = {
  listUsers: () => api.get('/users').then((r) => r.data),
  addUser: (data: any) => api.post('/users', data).then((r) => r.data),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data).then((r) => r.data),
  deleteUser: (id: number) => api.delete(`/users/${id}`).then((r) => r.data),
};

export const masterApi = {
  listProducts: () => api.get('/products').then((r) => r.data),
  addProduct: (data: any) => api.post('/products', data).then((r) => r.data),
  updateProduct: (id: number, data: any) => api.put(`/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: number) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const transactionApi = {
  addToCart: (produk_id: number, jumlah: number) =>
    api.post('/cart/add', { produk_id, jumlah }).then((r) => r.data),
  viewCart: () => api.get('/cart').then((r) => r.data),
  checkout: () => api.post('/checkout', {}).then((r) => r.data),
  listTransactions: () => api.get('/transactions').then((r) => r.data),
  payTransaction: (id: number) => api.put(`/transactions/${id}/pay`).then((r) => r.data),
};
