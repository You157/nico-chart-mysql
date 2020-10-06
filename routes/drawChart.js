const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const diffModel = require('../models/dayInfoDiff');
const moment = require('moment');
const Op = require('sequelize').Op;
const async = require('async');

router.get('/', function (req, res, next) {
  var p = req.query.p;
  var y = moment({ y: req.query.y }).format('YYYY');
  var m = moment({ M: (req.query.m - 1)}).format('MM');
  let result = { 'labels': [], 'videos': [], 'views': [], 'comments': [] };
  switch (p) {
    case '0':
      diffModel.findAll({
        attributes: [
          'group_year',
          [sequelize.fn('sum', sequelize.col('diff_videos')), 'total_videos'],
          [sequelize.fn('sum', sequelize.col('diff_views')), 'total_views'],
          [sequelize.fn('sum', sequelize.col('diff_comments')), 'total_comments'],
        ],
        group: ['group_year'],
        order: [['group_year', 'ASC']]
      }).then(datas => {
        console.log(`--- ${datas}`);
        async.each(datas, (data, callback) => {
          result.labels.push(data.dataValues.group_year);
          result.videos.push(data.dataValues.total_videos);
          result.views.push(data.dataValues.total_views);
          result.comments.push(data.dataValues.total_comments);
          callback();
        }, () => {
          res.json(result);
        });
      });
      break;
    case '1':
      diffModel.findAll({
        where: { group_year: y },
        attributes: [
          'group_year',
          'group_month',
          [sequelize.fn('sum', sequelize.col('diff_videos')), 'total_videos'],
          [sequelize.fn('sum', sequelize.col('diff_views')), 'total_views'],
          [sequelize.fn('sum', sequelize.col('diff_comments')), 'total_comments'],
        ],
        group: ['group_year', 'group_month'],
        order: [['group_month', 'ASC']]
      }).then(datas => {
        async.each(datas, (data, callback) => {
          result.labels.push(`${data.dataValues.group_year}-${data.dataValues.group_month}`);
          result.videos.push(data.dataValues.total_videos);
          result.views.push(data.dataValues.total_views);
          result.comments.push(data.dataValues.total_comments);
          callback();
        }, () => {
          res.json(result);
        });
      });
      break;
    case '2':
      diffModel.findAll({
        where: { group_year: y, group_month: m },
        order: [['date', 'ASC']]
      }).then(datas => {
        async.each(datas, (data, callback) => {
          result.labels.push(data.dataValues.date);
          result.videos.push(data.dataValues.diff_videos);
          result.views.push(data.dataValues.diff_views);
          result.comments.push(data.dataValues.diff_comments);
          callback();
        }, () => {
          res.json(result);
        });
      });
      break;
    case '3':
      break;
  }
  /*
  var datas = {
    'labels': ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    'videos': [100000, 110000, 120000, 130000, 140000, 150000, 160000],
    'views': [200000, 210000, 220000, 230000, 240000, 250000, 260000],
    'comments': [5000, 6000, 7000, 8000, 9000, 10000, 11000]
  };
  res.json(datas);
  */
});

module.exports = router;