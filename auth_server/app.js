const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const _ = require('lodash')
const mysql = require('mysql');

const indexRouter = require('./routes');
const lessonsRouter = require('./routes/lessons');
const authRouter = require('./routes/auth/auth');
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin/admin')
const {retrieveUserIdFromRequest} = require("./middleware/getUser.middleware");
const {checkIfAuthenticated} = require("./middleware/auth.middleware");
const {checkIfAuthorized} = require("./middleware/authorization.middleware");

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(retrieveUserIdFromRequest)

app.use('/', indexRouter);
app.use('/lessons', checkIfAuthenticated, _.partial(checkIfAuthorized, ["USER"]), lessonsRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', checkIfAuthenticated, _.partial(checkIfAuthorized, ["ADMIN"]), adminRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: 'error'});
});


module.exports = app;
