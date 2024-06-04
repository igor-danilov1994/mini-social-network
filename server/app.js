const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {connect} = require("mongoose");
const cors = require('cors')

const app = express();

const DB_URL = `mongodb+srv://igordanilov1824:test@cluster0.nzgd0mj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// view engine setup
app.use(cors())
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// dotenv.config()

async function start ()  {
  try {
    await connect(DB_URL)

    console.log(`mongoDB connected success`)
  } catch (e){
    console.log(' mongoDB connected error ')
  }
}

start()


//distribution static file
app.use('/uploads', express.static('uploads'))

app.use('/api', require('./routes'))

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
