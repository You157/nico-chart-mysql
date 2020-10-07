'use strict';
/** totalModelに情報を更新するプログラムです */

const fs = require('fs');
const csvParse = require('csv-parse');
const totalModel = require('../models/dayInfoTotal');
const path = 'downloads/all/total/all.tsv';
const logger = require('../logger');

const updateTotalModel = () => {
  return new Promise(resolve => {
    var rs = fs.createReadStream(path, 'utf-8');
    var parser = csvParse({
      delimiter: '\t',
      columns: ['date', 'time', 'unixTime', 'totalVideos', 'totalViews', 'totalComments']
    });
    rs.pipe(parser).on('data', (data) => {
      checkDataInTotalModel(data).then(data => {
        totalModel.create({
          date: data.date,
          time: data.time,
          unix_time: data.unixTime,
          total_videos: data.totalVideos,
          total_views: data.totalViews,
          total_comments: data.totalComments,
        });
        console.log(`totalDB: ない値なので更新: ${Object.entries(data)}`);
        logger.info(`totalDB: ない値なので更新: ${Object.entries(data)}`);
      }).catch((err) => {
        console.log(err);
      });
    }).on('end', () => {
      resolve();
    });
  });
}

// modelに既にデータが格納されているか検証する処理
function checkDataInTotalModel(data) {
  return new Promise((resolve, reject) => {
    totalModel.count({
      where: { date: data.date }
    }).then(count => {
      if (count == 0) {
        resolve(data);
      } else {
        reject('既に格納されているのでスキップ');
      }
    });
  });
}

module.exports = updateTotalModel;