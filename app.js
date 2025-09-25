import express from "express";
import { port } from './config/env.js'

import userRouter from './route/user.routes.js'
import authRouter from './route/auth.routes.js'
import subscriptionRouter from './route/subscription.routes.js'

import connectToDatabase from "./database/mongodb.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use('/api/vi/auth', authRouter);
app.use('/api/vi/users', userRouter);
app.use('/api/vi/subscriptions', subscriptionRouter);

app.use(errorMiddleware)


app.get('/', (req, res) => {
    res.send("Welcome to teh subscription tracker API")
})

app.listen(port, async () => {
    console.log(`Subscription tracker API is running on port http://localhost:${port}`);

    await connectToDatabase()
})