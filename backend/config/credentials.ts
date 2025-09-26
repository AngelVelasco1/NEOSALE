process.loadEnvFile();
import MercadoPagoConfig from "mercadopago";

const {
  HOST = "localhost",
  PORT = "8000",
  FRONT_PORT = "3000",
  CORS_ORIGIN = `http://${HOST}:${FRONT_PORT}`,
  FRONTEND_URL = `http://${HOST}:${FRONT_PORT}`,
  BACKEND_URL = `http://${HOST}:${PORT}`,
} = process.env;

export const BACK_CONFIG = {
  host: HOST,
  port: PORT,
  front_port: FRONT_PORT,
  cors_origin: CORS_ORIGIN,
  frontend_url: FRONTEND_URL,
  backend_url: BACKEND_URL,
};

const validateMPCredentials = (): string => {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Access Token de MercadoPago no configurado");
  }

  return token;
};

export const createMPClient = (): MercadoPagoConfig => {
  const accessToken = validateMPCredentials();

  return new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 10000,
      integratorId: "dev_24c65fb163bf11ea96500242ac130004",
    },
  });
};
