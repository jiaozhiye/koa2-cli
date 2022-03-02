/**
 * ajax 服务路由集合
 */
const Router = require('koa-router');
const controllers = require('../controllers');
const router = new Router();

// 路由列表
router.post('/login', controllers.login.login);
router.post('/api/design/upload', controllers.api.upload);
router.post('/api/design/getTableData', controllers.api.getTableData);
router.get('/api/design/getTableKeys', controllers.api.getTableKeys);
router.get('/api/design/getSummationData', controllers.api.getSummationData);
router.get('/api/design/getTableAuth', controllers.api.getTableAuth);
router.get('/api/design/getSelectData', controllers.api.getSelectData);
router.get('/api/design/getTreeData', controllers.api.getTreeData);
router.get('/api/design/getRegionData', controllers.api.getRegionData);

module.exports = router;
