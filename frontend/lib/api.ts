import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});


api.interceptors.request.use((config) => {

  const userId = typeof window !== 'undefined' ? localStorage.getItem('currentUserId') : null;
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

export default api;