'use strict';
/** diffModelにデータ差分を格納するプログラムです */
const moment = require('moment');
const totalModel = require('../models/dayInfoTotal');
const diffModel = require('../models/dayInfoDiff');
const logger = require('../logger');

let today = moment('2007-06-19').format('YYYY-MM-DD');
let yesterday = null;

const updateDiffModel = async () => {
  while (true) {
    try {
      await checkDataInDiffModel(today).then(today => {
        return checkDataInTotalModel(today);
      }).then(today => {
        yesterday = moment(today).add(-1, 'd').format('YYYY-MM-DD');
        return getDataTotalModel(today, yesterday);
      }).then(data => {
        return diff(data);
      }).then(data => {
        diffModel.create({
          date: data.date,
          group_year: data.group_year,
          group_month: data.group_month,
          diff_videos: data.diff_videos,
          diff_views: data.diff_views,
          diff_comments: data.diff_comments,
        });
      }).catch((flag) => {
        if (flag) { throw new Error('diffModel: totalModelにない値なので終了') }
      }).finally(() => {
        today = moment(today).add(1, 'd').format('YYYY-MM-DD');
      });
    } catch (err) {
      logger.info(err);
      break;
    }
  }
}

/**
 * diffModelにtodayが存在するか検証する
 * @param {date} today
 * @return {date} today ← 存在しない場合
 * @return {boolean} flag
 */
function checkDataInDiffModel(today) {
  return new Promise((resolve, reject) => {
    diffModel.count({
      where: { date: today }
    }).then(count => {
      if (count == 0) {
        resolve(today);
      } else {
        reject(false); // while終了フラグ
      }
    });
  });
}

/**
 * totalModelにtodayが存在しないか検証する
 * @param {date} today
 * @return {date} today ← 存在する場合
 * @return {boolean} flag
 */
function checkDataInTotalModel(today) {
  return new Promise((resolve, reject) => {
    totalModel.count({
      where: { date: today }
    }).then(count => {
      if (count == 0) {
        reject(true);  // while終了フラグ
      } else {
        resolve(today);
      }
    });
  });
}

/** day_info_totalから指定日とその前日のデータを取得するPromise */
function getDataTotalModel(today, yesterday) {
  return new Promise(resolve => {
    totalModel.findAll({
      where: {
        date: [today, yesterday]
      },
      order: [['date', 'ASC']]
    }).then(datas => {
      resolve(datas);
    });
  });
}

/** 前日との差を計算する */
function diff(datas) {
  return new Promise(resolve => {
    var today = datas[1].dataValues;
    var yesterday = datas[0].dataValues;
    var diffVideos = Math.abs(today.total_videos - yesterday.total_videos);
    var diffViews = Math.abs(today.total_views - yesterday.total_views);
    var diffComments = Math.abs(today.total_comments - yesterday.total_comments);
    var y = moment(today.date).year();
    var m = moment(today.date).month();
    var group_year = moment({ y: y }).format('YYYY');
    var group_month = moment({ M: m }).format('MM');
    const result = {
      date: today.date,
      group_year: group_year,
      group_month: group_month,
      diff_videos: diffVideos,
      diff_views: diffViews,
      diff_comments: diffComments
    }
    resolve(result);
  });
}

module.exports = updateDiffModel;