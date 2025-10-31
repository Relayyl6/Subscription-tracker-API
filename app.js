import express from "express";
import { port } from './config/env.js'

import userRouter from './route/user.routes.js'
import authRouter from './route/auth.routes.js'
import subscriptionRouter from './route/subscription.routes.js'

import connectToDatabase from "./database/mongodb.js";

import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleWare from "./middleware/arcjet.middleware.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(arcjetMiddleWare());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);



app.get('/', (req, res) => {
    res.send("Welcome to teh subscription tracker API")
})

app.listen(port, async () => {
    console.log(`Subscription tracker API is running on port http://localhost:${port}`);

    await connectToDatabase()
})