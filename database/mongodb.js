import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from '../config/env.js';
import process from 'process';

if (!MONGO_URI) {
    throw new Error("Please define teh MONGO_URI environment variable inside .env.<development/production>.local");
}

// connect to MONGODB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log(`connected to data base ${NODE_ENV} mode`)
    } catch(error) {
        console.error("Error occured whie connecting to teh database", error)
        process.exit(1)
    }
}

export default connectToDatabase;