/**
 * ajax 服务路由集合
 */
const Router = require('koa-router');
const controllers = require('../controllers');
const router = new Router();

// 路由列表
router.post('/login', controllers.login.login);
router.get('/api/design/getTableData', controllers.api.getTableData);
router.get('/api/design/getSelectData', controllers.api.getSelectData);
router.get('/api/design/getTreeData', controllers.api.getTreeData);

module.exports = router;
