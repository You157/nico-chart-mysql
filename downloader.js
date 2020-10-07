'use strict';
/** ニコチャートからZipファイルをダウンロード、解凍するプログラムです */

const rp = require('request-promise');
const fs = require('fs');
const unzipper = require('unzipper');
const url = 'http://www.nicochart.jp/total/all.zip';
const logger = require('./logger.js');

const downloader = () => {
  return new Promise(resolve => {
    rp({ method: 'GET', url: url, encoding: null },
      (err, res, body) => {
        // zipファイルを保存する
        fs.writeFileSync('./downloads/all.zip', body, 'binary');
      }).then(() => {
        console.log('zipファイルダウンロード完了');
        logger.info('zipファイルダウンロード完了');
        // zipファイルを解凍する
        fs.createReadStream('./downloads/all.zip').pipe(unzipper.Extract({ path: './downloads/all' }));
      }).then(() => {
        console.log('解凍完了');
        logger.info('解凍完了');
        resolve();
      }).catch((err) => {
        console.log(err);
        logger.error(err);
      });
  });
}

const updateTotalModel = require('./crawler/updateTotalModel');
const updateDiffModel = require('./crawler/updateDiffModel');

downloader().then(() => {
  return updateTotalModel();
}).then(() => {
  return updateDiffModel();
}).catch(err => {
  logger.error(err);
});

module.exports = downloader;