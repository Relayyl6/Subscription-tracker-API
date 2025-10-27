import mongoose from "mongoose"
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // logic to create a transaction
        const { name, email, password } = req.body;

        // check if a user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409
            throw error
        }

        // if !existingUser, tehn hash password for the current user
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await userModel.create([{
            name,
            email,
            password: hashedPassword
        }], { session })

        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        ) 

        await session.commitTransaction()
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User Successfully Created",
            data: {
                token,
                user: newUsers[0]
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.statusCode = 400;
            return next(error);
        }

        // find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!user.password) {
            const error = new Error('Authentication configuration error');
            error.statusCode = 500;
            return next(error);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }

        if (!JWT_SECRET) {
            const error = new Error('Authentication not configured');
            error.statusCode = 500;
            return next(error);
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // sanitize user object before sending
        const userObj = user.toObject ? user.toObject() : { ...user };
        if (userObj.password) delete userObj.password;

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: userObj
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {

}