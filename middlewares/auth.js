const debug = require('debug')('debug:log');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * 权限处理模块
 */
module.exports = () => {
  return async (ctx, next) => {
    if (config.auth.blackList.some((x) => ctx.path.startsWith(x))) {
      let token = ctx.headers['x-access-token'] || (ctx.request.body && ctx.request.body.token) || ctx.query.token;
      try {
        jwt.verify(token, config.auth.admin_secret);
      } catch (e) {
        const msg = e.name === 'TokenExpiredError' ? 'token 已过期, 请重新登录！' : 'token 验证失败, 请重新登录！';
        return (ctx.body = {
          code: -2, // 需要重新登录的 code
          msg,
        });
      }
      debug('鉴权成功');
    }
    await next();
  };
};
