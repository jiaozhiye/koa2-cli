/**
 * @Author: jzy
 * @Date: 2016/10/17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-03-13 09:30:25
 */
const mysql = require('mysql2');
const pool = require('./pool');
const promisePool = pool.promise();

/**
 * @param {String} sql 语句
 * @param {Array}  arr 替换数据
 */
const query = async (sql, arr) => {
  // Connection is automatically released when query resolves
  const [rows, fields] = await promisePool.query(sql, arr);
  return rows;
};

/**
 * @param {Function} (connection) => { return true|false }
 */
const transaction = async (querys) => {
  return new Promise(async (resolve, reject) => {
    const connection = await getConnection(pool);
    if (!connection) return;
    connection.beginTransaction(async (err) => {
      if (err) return resolve(false);
      let res = await querys(connection);
      // 交还连接池资源
      pool.releaseConnection(connection);
      if (res === false) {
        connection.rollback(() => console.log('事务回滚！'));
        return resolve(false);
      }
      connection.commit((err) => {
        if (err) {
          connection.rollback(() => console.log('事务回滚！'));
          return resolve(false);
        }
        resolve(res);
      });
    });
  });
};

// 使用在事务回调中的查询方法
const tranQuery = (connection, sql, arr) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, arr, (err, rows, fields) => {
      if (err) {
        resolve(false);
      } else {
        resolve(rows);
      }
    });
  });
};

// 获取连接资源
const getConnection = (pool) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        resolve(false);
      } else {
        resolve(connection);
      }
    });
  });
};

// 防止sql注入
const escape = (params) => mysql.escape(params);

// 格式化sql语句
const format = (sql, arr) => mysql.format(sql, arr);

module.exports = {
  query,
  transaction,
  tranQuery,
  escape,
  format,
};
