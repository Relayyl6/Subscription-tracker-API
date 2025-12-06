import { Router } from "express";
import authorise from "../middleware/auth.middleware.js";
import {cancelSubscription, createSubscription, deleteSubscription, getAllSubscriptions, getSubscriptionDetails, getUserSubscriptions, updateSubscription} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorise, getAllSubscriptions)

subscriptionRouter.get('/:id', authorise, getSubscriptionDetails)

subscriptionRouter.post('/', authorise, createSubscription)

subscriptionRouter.put('/:id', authorise, updateSubscription)

subscriptionRouter.delete('/:id', authorise, deleteSubscription)

subscriptionRouter.get('/user/:id', authorise, getUserSubscriptions)

subscriptionRouter.put('/:id/cancel', authorise, cancelSubscription)

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({
        title: "GET upcoming renewals"
    })
})

export default subscriptionRouter