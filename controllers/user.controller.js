import mongoose from 'mongoose'
import userModel from "../models/user.model.js"

// GET /api/v1/users
// Supports pagination, simple search (q), sorting and excludes password from results
export const getUsers = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
        const skip = (page - 1) * limit;
        const sort = req.query.sort || '-createdAt';

        // simple search by name or email
        const filter = {};
        if (req.query.q) {
            const q = req.query.q.trim();
            if (q.length) {
                const re = new RegExp(q, 'i');
                filter.$or = [{ name: re }, { email: re }];
            }
        }

        const [users, total] = await Promise.all([
            userModel.find(filter)
                .select('-password')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            userModel.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: users,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit) || 1
            }
        });
    } catch (error) {
        next(error);
    }
}

// GET /api/v1/users/:id
// Validates id, excludes password and forwards not-found to error middleware
export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid user id');
            error.statusCode = 400;
            return next(error);
        }

        const user = await userModel.findById(id).select('-password').lean();

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

