const db = require('../models/db');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('../config');
const debug = require('debug')('debug:log');

const login = async (ctx, next) => {
  // console.log(ctx.request.body)
  let { username, password } = ctx.request.body;
  let rows = [];

  try {
    // 数据库 I/O
    rows = await db.query(
      `
        SELECT 
            t1.id, t1.name, t1.role_id, t2.name roles
        FROM 
            user t1
        LEFT JOIN 
            role t2
        ON 
            t1.role_id=t2.id
        WHERE 
            t1.username=?
        AND 
            t1.password=?
        AND 
            t1.deleted='0'
        AND 
            t2.deleted='0'
        `,
      [username, md5(md5(password))]
    );
  } catch (e) {
    console.error(e);
  }
  // console.log(rows)

  try {
    let [data] = rows;

    if (!data) {
      return (ctx.state.msg = '用户名或密码错误！');
    }

    // token签名 有效期为24小时
    let token = jwt.sign({ name: data.name }, config.auth.admin_secret, {
      expiresIn: '24h',
    });

    // 记录 session, 记录角色ID
    ctx.session.role_id = data.role_id;

    // 返回数据
    ctx.body = {
      code: 1,
      msg: '登录成功!',
      data: {
        id: data.id,
        name: data.name,
        roles: [data.roles],
        token,
      },
    };
  } catch (e) {
    console.error(e);
  }
};

const logout = async (ctx, next) => {
  ctx.session = null;
  ctx.cookies.set('Admin-Token', null, { maxAge: -1 });
  ctx.state.code = -2;
  ctx.state.msg = '成功退出登录！';
};

module.exports = {
  login,
  logout,
};
