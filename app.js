// const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize =  require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp=require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// const compression = require('compression');
// const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
console.log(app.get('env'));      //env variables are usual global
// console.log(process.env.NODE_ENV);  
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // middleware // app.use()
app.use(express.static(`${__dirname}/public`));      //the actual url: http://localhost:8000/overview.html 
// app.use(express.static(`${__dirname}/public/img`));  
app.use(cookieParser());

// create our own middleware
// app.use((req, res, next) => {
//   console.log('Hello from middleware 😍');
//   next();
// })

app.use((req, res, next) => {
  console.log(req.requestTime = new Date().toISOString());
  console.log(req.headers);
  console.log(req.cookies);
  next();
});

// Route handlers

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/users', reviewRouter);
app.use('/api/v1/reviews', reviewRouter);
// Start server
// Start server
// const port = 8000;
// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}... `);
// });

// for unhandled routes
app.all('*', (req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this site`, 404));
  });

app.use(globalErrorHandler);
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
// });
// });

module.exports = app;