'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

// define('ﾓﾃﾞﾙ名',{ｶﾗﾑ定義},{ｵﾌﾟｼｮﾝ設定});
const totalModel = loader.database.define('day_info_total', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false
  },
  time: {
    type: Sequelize.INTEGER
  },
  unix_time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  total_videos: {
    type: Sequelize.BIGINT
  },
  total_views: {
    type: Sequelize.BIGINT
  },
  total_comments: {
    type: Sequelize.BIGINT
  }
}, {
    freezeTableName: true, // DBのﾃｰﾌﾞﾙ名をｽｸﾘﾌﾟﾄで指定した名前で作成する？
    timestamps: false,
  });

totalModel.sync();

module.exports = totalModel;