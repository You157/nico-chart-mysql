const express = require('express');
const router = express.Router();
const moment = require('moment');
const async = require('async');
const connection = require('../models/connection').connection;

router.get('/', function (req, res, next) {
  let params = req.query.p;
  let year = moment({ y: req.query.y }).format('YYYY');
  let month = moment({ M: (req.query.m - 1) }).format('MM');
  let resultJson = { 'labels': [], 'videos': [], 'views': [], 'comments': [] };
  let videosCount;
  let viewsCount;
  let commentsCount;
  switch (params) {
    case '0':
      var sql = `(select * from total where date like '%-12-31') 
        union (select * from total order by date desc limit 1)`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        let before = {
          total_videos: 0, total_views: 0, total_comments: 0
        };
        async.each(result, (data, callback) => {
          videosCount = data.total_videos - before.total_videos;
          viewsCount = data.total_views - before.total_views;
          commentsCount = data.total_comments - before.total_comments;
          before = data;
          resultJson.labels.push(data.date.slice(0, 4));
          resultJson.videos.push(videosCount);
          resultJson.views.push(viewsCount);
          resultJson.comments.push(commentsCount);
          callback();
        }, () => {
          res.json(resultJson);
        });
      });
      break;
    case '1':
      var sql = `
        select * from total where date in (
          '${year - 1}-12-31', '${year}-01-31', last_day('${year}-02-01'), '${year}-03-31', '${year}-04-30', 
          '${year}-05-31', '${year}-06-30', '${year}-07-31', '${year}-08-31', 
          '${year}-09-30', '${year}-10-31', '${year}-11-30', '${year}-12-31'        
        ) order by date asc`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        let i = 0;
        let before;
        async.each(result, (data, callback) => {
          if (i != 0) {
            videosCount = data.total_videos - before.total_videos;
            viewsCount = data.total_views - before.total_views;
            commentsCount = data.total_comments - before.total_comments;
            resultJson.labels.push(data.date.slice(0, 7));
            resultJson.videos.push(videosCount);
            resultJson.views.push(viewsCount);
            resultJson.comments.push(commentsCount);
          }
          i++;
          before = data;
          callback();
        }, () => {
          res.json(resultJson);
        });
      });
      break;
    case '2':
      var sql = `
        select * from total 
          where date like '${year}-${month}%'
        union select * from total
          where date = date_sub('${year}-${month}-01', interval 1 day)
        order by date asc
        `;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        let i = 0;
        let before;
        async.each(result, (data, callback) => {
          if (i != 0) {
            videosCount = data.total_videos - before.total_videos;
            viewsCount = data.total_views - before.total_views;
            commentsCount = data.total_comments - before.total_comments;
            resultJson.labels.push(data.date);
            resultJson.videos.push(videosCount);
            resultJson.views.push(viewsCount);
            resultJson.comments.push(commentsCount);
          }
          i++;
          before = data;
          callback();
        }, () => {
          res.json(resultJson);
        });
      });
      break;
    case '3':
      break;
  }
});

module.exports = router;