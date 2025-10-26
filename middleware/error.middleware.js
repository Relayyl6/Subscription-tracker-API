const errorMiddleware = (err, req, res , next) => {
    try {
        let error = { ...err }

        error.message = err.message

        console.error(err);

        // Figuring out the type of the error

        // eg Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = "Resource not found";
            error = new Error(message)
            error.statusCode = 404;
        }

        if (
            err.name === 'DocumentNotFoundError' ||
            err.name === 'NotFoundError' ||
            err.statusCode === 404 ||
            (typeof err.message === 'string' && /not found/i.test(err.message))
        ) {
            const message = err.message || "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = "Duplicate field value entered";
            error = new Error(message)
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message)
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        // JWT Authentication errors
        if (err.name === 'JsonWebTokenError') {
            const message = 'Invalid token. Please log in again';
            error = new Error(message);
            error.statusCode = 401;
        }

        // JWT Token Expiration
        if (err.name === 'TokenExpiredError') {
            const message = 'Your token has expired. Please log in again';
            error = new Error(message);
            error.statusCode = 401;
        }

        // Payment related errors (for subscription handling)
        if (err.type === 'StripeCardError') {
            const message = err.message || 'Payment processing failed';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Rate limiting errors
        if (err.name === 'TooManyRequests') {
            const message = 'Rate limit exceeded. Please try again later';
            error = new Error(message);
            error.statusCode = 429;
        }

        // Database connection errors
        if (err.name === 'MongoServerError') {
            const message = 'Database operation failed';
            error = new Error(message);
            error.statusCode = 500;
        }

        // Subscription status errors
        if (err.name === 'SubscriptionError') {
            const message = err.message || 'Subscription operation failed';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Request timeout
        if (err.name === 'TimeoutError') {
            const message = 'Request timeout. Please try again';
            error = new Error(message);
            error.statusCode = 408;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error"
        })
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware