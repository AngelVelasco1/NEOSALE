const {
  HOST = "localhost",
  PORT = "8000",
  FRONT_PORT = "3000",
  CORS_ORIGIN = `http://${HOST}:${FRONT_PORT}`,
  FRONTEND_URL = `http://${HOST}:${FRONT_PORT}`,
  BACKEND_URL = `http://${HOST}:${PORT}`,
  ENVIOCLICK_API_KEY = "",
  ENVIOCLICK_API_URL = "https://api.envioclickpro.com.co",
} = process.env;

export const BACK_CONFIG = {
  host: HOST,
  port: PORT,
  front_port: FRONT_PORT,
  cors_origin: CORS_ORIGIN,
  frontend_url: FRONTEND_URL,
  backend_url: BACKEND_URL,
};

export const ENVIOCLICK_CONFIG = {
  apiKey: ENVIOCLICK_API_KEY,
  apiUrl: ENVIOCLICK_API_URL,
};
