import dotenv from "dotenv"

dotenv.config();

export const BACK_CONFIG = {
    host: process.env.HOST,
    port: process.env.PORT,
    front_port: process.env.FRONT_PORT,
    key: process.env.JWT_SECRET
};