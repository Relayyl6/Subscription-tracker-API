import mongoose from "mongoose"
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    // Validate input early
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        const error = new Error('Name, email and password are required');
        error.statusCode = 400;
        return next(error);
    }

    if (typeof password !== 'string' || password.length < 6) {
        const error = new Error('Password must be at least 6 characters long');
        error.statusCode = 400;
        return next(error);
    }

    const session = await mongoose.startSession();
    let createdUser;

    try {
        // Use withTransaction to ensure commit/abort semantics
        await session.withTransaction(async () => {
            // check if a user already exists (in the transaction session)
            const existingUser = await userModel.findOne({ email }).session(session);
            if (existingUser) {
                const error = new Error('User already exists');
                error.statusCode = 409;
                throw error;
            }

            // hash password with explicit salt rounds
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const created = await userModel.create([
                {
                    name,
                    email,
                    password: hashedPassword
                }
            ], { session });

            // created is an array because we used create with an array
            createdUser = created[0];
        });

        // ensure we have a created user
        if (!createdUser) {
            const error = new Error('Failed to create user');
            error.statusCode = 500;
            throw error;
        }

        if (!JWT_SECRET) {
            const error = new Error('Authentication not configured');
            error.statusCode = 500;
            throw error;
        }

        const token = jwt.sign(
            { userId: createdUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // sanitize user object before sending (remove password)
        const userObj = createdUser.toObject ? createdUser.toObject() : { ...createdUser };
        if (userObj.password) delete userObj.password;

        res.status(201).json({
            success: true,
            message: 'User successfully created',
            data: {
                token,
                user: userObj
            }
        });
    } catch (error) {
        // allow the error middleware to map/format the error
        next(error);
    } finally {
        session.endSession();
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
            data: { token, user: userObj }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {

}