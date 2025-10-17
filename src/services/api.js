import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // Increased timeout
  withCredentials: false,
  validateStatus: (status) => status < 500 // Handle only server errors as errors
});

// Request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['User-Id'] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const api = {
  // Auth endpoints
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),

  // Transaction endpoints
  getAllTransactions: () => axiosInstance.get('/transactions'),
  createTransaction: (transaction) => axiosInstance.post('/transactions', transaction),
  updateTransaction: (id, transaction) => axiosInstance.put(`/transactions/${id}`, transaction),
  deleteTransaction: (id) => axiosInstance.delete(`/transactions/${id}`),

  // Category endpoints
  getAllCategories: () => axiosInstance.get('/categories'),
  createCategory: (category) => axiosInstance.post('/categories', category),
  updateCategory: (id, category) => axiosInstance.put(`/categories/${id}`, category),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),

  // Budget endpoints
  getAllBudgets: () => axiosInstance.get('/budgets'),
  createBudget: (budget) => axiosInstance.post('/budgets', budget),
  updateBudget: (id, budget) => axiosInstance.put(`/budgets/${id}`, budget),
  deleteBudget: (id) => axiosInstance.delete(`/budgets/${id}`),

  // Summary endpoints
  getMonthlySummary: () => axiosInstance.get('/summary/monthly'),
  getCategorySummary: () => axiosInstance.get('/summary/category')
};
