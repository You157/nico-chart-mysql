'use strict';
/** ニコチャートからZipファイルをダウンロード、解凍するプログラムです */

const rp = require('request-promise');
const fs = require('fs');
const unzipper = require('unzipper');
const url = 'http://www.nicochart.jp/total/all.zip';
const logger = require('../logger');

const downloader = ()=>{
  return new Promise(resolve=>{
    rp({method: 'GET', url: url, encoding: null},
    (err, res, body)=>{
      // zipファイルを保存する
      fs.writeFileSync('./downloads/all.zip', body, 'binary');
    }).then(()=>{
      logger.info('zipファイルダウンロード完了');
      // zipファイルを解凍する
      fs.createReadStream('./downloads/all.zip').pipe(unzipper.Extract({ path: './downloads/all' }));
    }).then(()=>{
      logger.info('解凍完了');
      resolve();
    }).catch((err) => {
      logger.error(err);
    });
  });
}

const updateTotalModel = require('./updateTotalModel');
const updateDiffModel = require('./updateDiffModel');
downloader().then(() => {
  return updateTotalModel();
}).then(() => {
  return updateDiffModel();
}).catch(err => {
  logger.error(err);
});

module.exports = downloader;