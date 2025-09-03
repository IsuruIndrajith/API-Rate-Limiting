//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter')
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')

let app = express();

let limiter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later!'
});

// use the rate limiter on all the APIs that are starting with /api
app.use('/api', limiter);

app.use(express.json());

app.use(express.static('./public'))

//USING ROUTES


app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;

