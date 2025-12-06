import { SERVER_URL } from '../config/env.js'
import { workflowClient } from '../config/qstash.js'
import subscriptionModel from '../models/subscription.model.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionModel.create({
            ...req.body,

            user: req.user._id,
        })

        const workflowId = await workflowClient.trigger({
          url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
          body: {
            subscriptionId: subscription.id
          },
          headers: {
            'Content-Type': 'application/json'
          },
          retries: 0,
        })

        res.status(201).json({
          success: true,
          data: {
            subscription,
            workflowId
          }
        })
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const paramId = req.params.id;

    // Ensure user is authenticated
    if (!userId) {
      const error = new Error("Unauthorized: user not found in token");
      error.statusCode = 401;
      return next(error);
    }

    // Prevent accessing another user's account
    if (userId !== paramId) {
      const error = new Error("Access denied: cannot view another user's subscriptions");
      error.statusCode = 403; // use 403 for "forbidden"
      return next(error);
    }

    // Fetch subscriptions
    const subscriptions = await subscriptionModel.find({
        user: paramId
    }).lean();

    // Optionally handle empty results
    if (!subscriptions.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No subscriptions found for this user",
      });
    }

    // Return subscriptions
    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

export const getSubscriptionDetails = async  (req, res, next) => {
  try { 
      const userId = req.user?.id;
      const paramId = req.params.id;

      // Ensure user is authenticated
      if (!userId) {
        const error = new Error("Unauthorized: user not found in token");
        error.statusCode = 401;
        return next(error);
      }

      // Prevent accessing another user's account
      if (userId !== paramId) {
        const error = new Error("Access denied: cannot view another user's subscriptions");
        error.statusCode = 403; // use 403 for "forbidden"
        return next(error);
      }

      const subscriptionDetail = await subscriptionModel.findById(
        paramId
      ).lean();

      if (!subscriptionDetail) {
        const error = new Error("Subscription not found");
        error.statusCode = 400;
        return next(error)
      }

      res.status(200).json({
        success: true,
        subscription: subscriptionDetail
      })
  } catch (error) {
    next(error)
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
      const userId = req.user?.id;
      const paramId = req.params.id;

      // Ensure user is authenticated
      if (!userId) {
        const error = new Error("Unauthorized: user not found in token");
        error.statusCode = 401;
        return next(error);
      }

      // Prevent accessing another user's account
      if (userId !== paramId) {
        const error = new Error("Access denied: cannot view another user's subscriptions");
        error.statusCode = 403; // use 403 for "forbidden"
        return next(error);
      }

      await subscriptionModel.findByIdAndDelete(paramId).lean();

      res.status(200).json({
        success: true,
        message: "Subscription Deleted"
      })
  } catch(error) {
    next(error)
  }
}

export const cancelSubscription = (req, res, next) => {
  try {
    let userId = req.user.id
    let paramId = req.params.id;

    // Ensure user is authenticated
    if (!userId) {
      const error = new Error("Unauthorized: user not found in token");
      error.statusCode = 401;
      return next(error);
    }
    // Prevent accessing another user's account
    if (userId !== paramId) {
      const error = new Error("Access denied: cannot view another user's subscriptions");
      error.statusCode = 403; // use 403 for "forbidden"
      return next(error);
    }

    const subscription = subscriptionModel.findById(paramId)

    subscription.status = "cancelled";

    res.status(200).json({
      success: "true",
      message: "subscription succesfully cancelled"
    })
  } catch (error) {
    next(error)
  }
}

export const getAllSubscriptions = (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      const error = new Error("Access denied: cannot view all user's subscriptions without having access");
      error.statusCode = 403; // use 403 for "forbidden"
      return next(error);
    }

    const allUsers = subscriptionModel.find();

    res.status(200).json({
      message: "all subscription info fetched successfully",
      users: allUsers
    })
  } catch (error) {
    next(error)
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    const paramId = req.params.id;
    const userId = req.user.id;

    // Ensure user is authenticated
    if (!userId) {
      const error = new Error("Unauthorized: user not found in token");
      error.statusCode = 401;
      return next(error);
    }
    // Prevent accessing another user's account
    if (userId !== paramId) {
      const error = new Error("Access denied: cannot view another user's subscriptions");
      error.statusCode = 403; // use 403 for "forbidden"
      return next(error);
    }

    const { name, price, currency, frequency, category, paymentMethod, status, startDate, renewalDate } = req.body;

    const subscription = subscriptionModel.findById(paramId).lean();

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      return next(error)
    }

    Object.assign(
      subscription, {
        ...(name && { name }),
        ...(price && { price }),
        ...(currency && { currency }),
        ...(frequency && { frequency }),
        ...(category && { category }),
        ...(paymentMethod && { paymentMethod }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(renewalDate && { renewalDate }),
    })

    await subscription.save()

    res.status(200).json({
      message: "subscription details updated successfully",
      subscription: subscription
    })
  } catch (error) {
    next(error);
  }
}