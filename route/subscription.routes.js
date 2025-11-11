import { Router } from "express";
import authorise from "../middleware/auth.middleware.js";
import {createSubscription, getSubscriptionDetails, getUserSubscriptions} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorise, (req, res) => {
    res.send({
        title: "GET all subscriptions"
    })
})

subscriptionRouter.get('/:id', authorise, getSubscriptionDetails)

subscriptionRouter.post('/', authorise, createSubscription)

subscriptionRouter.put('/:id', (req, res) => {
    res.send({
        title: "UPDATE subscription"
    })
})

subscriptionRouter.delete('/', (req, res) => {
    res.send({
        title: "DELETE subscription"
    })
})

subscriptionRouter.get('/user/:id', authorise, getUserSubscriptions)

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({
        title: "CANCEL subscription"
    })
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({
        title: "GET upcoming renewals"
    })
})

export default subscriptionRouter