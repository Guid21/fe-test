import axios from 'axios';
import { VITE_API_BASE } from '@/config';

export const client = axios.create({
  baseURL: VITE_API_BASE,
});
