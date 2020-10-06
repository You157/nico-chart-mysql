var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');

// ルータの読み込み
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var drawChartRouter = require('./routes/drawChart');

var app = express();
app.use(helmet()); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/drawChart', drawChartRouter);

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

/** 定期実行するプログラムです */
/*
const logger_ = require('./logger');
const cron = require('cron').CronJob;
const downloader = require('./crawler/downloader');
const updateTotalModel = require('./crawler/updateTotalModel');
const updateDiffModel = require('./crawler/updateDiffModel');
const cronJob = new cron({
  cronTime: '00 10 7 * * *', // 4時に実行
  start: true,
  onTick: () => {
    downloader().then(() => {
      return updateTotalModel();
    }).then(() => {
      return updateDiffModel();
    }).catch(err => {
      logger_.error(err);
    });
  }
});
*/
