'use strict';
const log4js = require('log4js');

log4js.configure({
  appenders: {
    infoLog: {type: 'file', filename:'./logs.log'}
  },
  categories: {
    default: { appenders: ['infoLog'], level: 'info' }
  }
})
const logger = log4js.getLogger();

module.exports = logger;
