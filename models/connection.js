'use strict';
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'yoush',
    password: 'mysql',
    database:'nico_chart'
});

connection.connect((err)=> {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = { connection: connection }