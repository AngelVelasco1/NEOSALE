
import { FRONT_CONFIG } from './credentials';
import axios from "axios";

export const api = axios.create({
  baseURL: `http://${FRONT_CONFIG.host}:${FRONT_CONFIG.port}`,
});