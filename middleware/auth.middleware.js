import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import userModel from "../models/user.model.js";
// import { getUser } from "../controllers/user.controller.js";

const authorise = async (req, res, next) => {
    try {
        let token;
        console.log(req.headers.authorization);

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }

        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            const err = new Error('Unauthorized');
            err.statusCode = 401;
            return next(err);
        };

        let decoded;

        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            const err = new Error(`Invalid or expired token, ${error}`);
            err.statusCode = 401;
            return next(err);
        }

        if (!decoded || !decoded.userId) {
            const err = new Error('Invalid token payload');
            err.statusCode = 401;
            return next(err);
        }

        const user = await userModel.findById(decoded.userId).select("-password");

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 401;
            return next(err);
        }

        req.user = user;

        next()
    } catch(error) {
        res.status(401).json({
            messsage: "Unauthorized",
            error: error.message,
        })
    }
}

export default authorise