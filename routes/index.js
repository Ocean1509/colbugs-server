/**
 * 路由
 * @param {*} app 
 */
const user = require('./users')
const report = require('./report')
const admin = require('./admin')
module.exports = (app) => {
  app.use('/', user); // 后台管理平台用户登录
  app.use('/report', report) // sdk上传接口
  app.use('/api', admin)
};
