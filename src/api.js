import axios from 'axios';

// export const baseURL = 'http://localhost:9000';
export const baseURL ='https://chatapplicationbackend-production.up.railway.app';
const api = axios.create({
    baseURL: `${baseURL}`,
  });
  
export default api;