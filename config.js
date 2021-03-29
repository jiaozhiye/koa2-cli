const CONF = {
  // 域名
  host: '127.0.0.1',
  // 端口号
  port: '3000',

  // 允许请求白名单
  whitelist: ['http://localhost:8081', 'http://localhost:8080'],

  // 权限校验
  auth: {
    admin_secret: 'admin-token',
    blackList: ['/api'], // 请求的黑名单前缀
  },

  /**
   * MySQL 配置
   */
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'app_cms',
    pass: 'root',
    char: 'utf8',
  },
};

module.exports = CONF;
