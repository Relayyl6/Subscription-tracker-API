import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorise from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers)

userRouter.get('/:id', authorise, getUser)

userRouter.post('/', (req, res) => {
    res.send({
        title: "CREATE all users"
    })
})

userRouter.put('/:id', (req, res) => {
    res.send({
        title: "UPDATE users"
    })
})

userRouter.delete('/:id', (req, res) => {
    res.send({
        title: "DELETE all users"
    })
})

export default userRouter