/**
 * @Author: jzy
 * @Date: 2016/10/17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-03-13 09:30:26
 */
const mysql = require('mysql2');
const { mysql: config } = require('../config');

const dbConf = {
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.pass,
  database: config.db,
  charset: config.char,
  multipleStatements: true, // 每个查询允许多个 mysql 语句
  connectionLimit: 10,
};

module.exports = mysql.createPool(dbConf);
