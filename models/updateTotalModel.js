'use strict';
/** totalModelに情報を更新するプログラムです */

const fs = require('fs');
const csvParse = require('csv-parse');
const { type } = require('os');
// const path = './downloads/all/total/all.tsv';
const path = './downloads/all/total/2007.tsv';
const logger = require('../logger');
const connection = require('./connection').connection;

const updateTotalModel = () => {
  return new Promise(resolve => {
    var rs = fs.createReadStream(path, 'utf-8');
    var parser = csvParse({
      delimiter: '\t',
      columns: ['date', 'time', 'unixTime', 'totalVideos', 'totalViews', 'totalComments']
    });    
    rs.pipe(parser).on('data', (data) => {
      checkDataInTotalModel(data).then(()=>{
        var sql = `INSERT INTO total ( 
            date, time, unix_time, total_videos, total_views, total_comments 
          ) VALUES ( 
            '${data.date}', ${data.time}, ${data.unixTime}, 
            ${data.totalVideos}, ${data.totalViews}, ${data.totalComments} 
          )`;  
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log(`insert success: ${data.date}`);
          logger.Default.info(`insert success: ${data.date}`);
        });
      }).catch();
    }).on('end', () => {
      console.log('Finish');
      logger.Default.info('DB更新処理終了');
      resolve();
    });
  });
}

// modelに既にデータが格納されているか検証する処理
function checkDataInTotalModel(data) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT COUNT(*) FROM total WHERE date = '${data.date}'`;
    connection.query(sql, function (err, result){
      if (err) throw err;
      // var flag = (result[0]['COUNT(*)'] <= 0) ? true: false;
      // return flag;
      if(result[0]['COUNT(*)'] >= 1){
        console.log('1以上含まれてるのでスキップします');
        reject();
      }else{
        console.log('0なので更新します');
        logger.Default.info('0なので更新します');
        resolve();
      }
    });
  });
}
updateTotalModel();
module.exports = updateTotalModel;
