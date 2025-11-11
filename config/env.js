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
    ARCJET_KEY,
    QSTASH_URL,
    QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    SERVER_URL,
    EMAIL_PASSWORD,
    ACCOUNT_EMAIL,
} = process.env;