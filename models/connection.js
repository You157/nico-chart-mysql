'use strict';
const mysql = require('mysql2');

const connection = mysql.createConnection({
  /*
  host:'localhost',
  user:'yoush',
  password: 'mysql',
  database:'nico_chart'
  */
  host:'us-cdbr-east-02.cleardb.com',
  user:'beca2f0462ec18',
  password: '835ade6e',
  database:'heroku_0231a46a5335cc6'
});

connection.connect((err)=> {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = { connection: connection }