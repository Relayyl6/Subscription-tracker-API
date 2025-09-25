import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Username is required'
        ],
        trim: true,
        minLength: 5,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [
            true,
            'Email is required'
        ],
        trim: true,
        match: [
            /\S+@\S+\.\S+/, 'Please fill a valid email address'
        ],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: [
            true,
            "User Password is required"
        ],
        minLength: 6
    }
}, { timestamps: true }
)

const userModel = mongoose.Model('User', userSchema)

export default userModel