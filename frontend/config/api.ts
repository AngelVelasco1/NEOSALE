
import axios from "axios";
import { FRONT_CONFIG } from './credentials';

export const api = axios.create({
  baseURL: `http://${FRONT_CONFIG.host}:${FRONT_CONFIG.port}`,
});