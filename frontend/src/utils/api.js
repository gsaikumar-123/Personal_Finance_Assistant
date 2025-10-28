import axios from 'axios';

const baseURL = "https://localhost:1234/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (userData) => api.post('/signup', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.get('/logout'),
  getProfile: () => api.get('/profile/view'),
};

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  add: (transaction) => api.post('/transactions/add', transaction),
  getByType: (type) => api.get(`/transactions/${type}`),
  update: (id, transaction) => api.put(`/transactions/update/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/delete/${id}`),
  filterByDate: (fromDate, toDate) => api.get(`/transactions/filter/${fromDate}/${toDate}`),
  filterByCategory: (category) => api.get(`/transactions/filter/${category}`),
};

export default api; 