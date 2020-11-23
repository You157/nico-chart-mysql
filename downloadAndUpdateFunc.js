'use strict';

const downloader = require('./downloader');
const updateTotalModel = require('./models/updateTotalModel');
const logger = require('./logger');

downloader().then(() => {
  return updateTotalModel();
}).catch(err => {
  logger.Error.error('cron: エラー発生');
});
