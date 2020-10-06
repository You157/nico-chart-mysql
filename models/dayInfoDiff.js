'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

// define('ﾓﾃﾞﾙ名',{ｶﾗﾑ定義},{ｵﾌﾟｼｮﾝ設定});
const diffModel = loader.database.define('day_info_diff', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false
  },
  group_year:{
    type: Sequelize.STRING
  },
  group_month:{
    type: Sequelize.STRING
  },
  diff_videos: {
    type: Sequelize.BIGINT
  },
  diff_views: {
    type: Sequelize.BIGINT
  },
  diff_comments: {
    type: Sequelize.BIGINT
  }
}, {
  freezeTableName: true, // DBのﾃｰﾌﾞﾙ名をｽｸﾘﾌﾟﾄで指定した名前で作成する？
  timestamps: false,
});

diffModel.sync();

module.exports = diffModel;