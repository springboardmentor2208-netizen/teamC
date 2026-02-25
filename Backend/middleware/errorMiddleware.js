const errorHandler = (err, req, res, next) => {
    // Express 5 starts res.statusCode at 200, so we must treat 200 as "not set"
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    // Handle Mongoose duplicate key error (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const value = err.keyValue?.[field] || '';
        return res.status(400).json({
            message: `An account with that ${field} (${value}) already exists.`,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler
};
