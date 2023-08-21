const notFound = (res, req, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.Json({
        message: err.message,
        stack: process.env.MODE_ENV === 'production' ? null : err.stack,
    });

};

module.exports = { notFound, errorHandler };
