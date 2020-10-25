'use strict';
const connection = require('./connection').connection;

const createTotalModel = ()=>{
  var sql = `CREATE TABLE total (
    id INT unsigned AUTO_INCREMENT, 
    date TEXT, time SMALLINT, 
    unix_time INT unsigned,
    total_videos INT unsigned, 
    total_views BIGINT unsigned, 
    total_comments BIGINT unsigned, 
    PRIMARY KEY (id))`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Total Table created");
  });
}

module.exports = createTotalModel;