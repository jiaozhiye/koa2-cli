const path = require('path');
const debug = require('debug')('debug:log');
const config = require('../config');
const router = require('../routes');
const response = require('./response');
const auth = require('./auth');
const session = require('koa-session');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');

module.exports = (app) => {
  app.keys = ['a newer secret']; // 签名，用于 cookie/session 加密

  // 使用 session 中间件
  app.use(session({ rolling: true, renew: true }, app));

  // 响应处理中间件
  app.use(response);

  // 使用 cors 中间件处理跨域
  app.use(cors({ origin: config.whitelist[0], credentials: true }));

  // 解析 POST请求 及 文件上传
  app.use(
    koaBody({
      multipart: true,
      jsonLimit: 20 * 1024 * 1024,
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      },
    })
  );

  // 权限中间件
  // app.use(auth());

  // 静态资源服务中间件
  app.use(koaStatic(path.resolve(__dirname, '../../', 'dist')));
  app.use(koaStatic(path.resolve(__dirname, '../', 'uploads')));

  // 路由分发中间件
  app.use(router.routes());

  // 处理 404
};
