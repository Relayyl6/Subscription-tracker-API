import subscriptionModel from '../models/subscription.model.js'

const createSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionModel.create({
            ...req.body,

            user: req.user._id,
        })

        res.status(201).json({
            succes: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

export default createSubscription