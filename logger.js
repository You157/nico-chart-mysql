'use strict';
const log4js = require('log4js');

log4js.configure({
  appenders: {
    system:{type: 'file', filename:'./logs/system.log'},
    debug:{type:'file', filename:'./logs/debug.log'},
    systemError:{type: 'file', filename:'./logs/error.log'},
  },
  categories: {
    default: { appenders: ['system'], level: 'info' },
    debug: {appenders:['debug'], level:'debug'},
    errLog: {appenders:['systemError'], level:'info'},
  }
})
const Default = log4js.getLogger('default');
const Debug = log4js.getLogger('debug');
const Error = log4js.getLogger('errLog');

module.exports = {
  Default: Default,
  Debug: Debug,
  Error: Error
}
