const Koa = require('koa');
const debug = require('debug')('debug:log');
const config = require('./config');
const middleware = require('./middlewares');
const app = new Koa();

// 挂载中间件
middleware(app);

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`));
