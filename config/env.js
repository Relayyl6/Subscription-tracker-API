import { config } from "dotenv";
import process from "process";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const { port, NODE_ENV, MONGO_URI } = process.env;