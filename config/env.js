import { config } from "dotenv";
import process from "process";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    port,
    NODE_ENV,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_ENV,
    ARCJET_KEY
} = process.env;