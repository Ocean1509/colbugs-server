const express = require('express');
const app = express();
const bodyParser = require('body-parser');// 解析body字段模块
const morgan = require('morgan'); // 命令行log显示
const log = require('log4js')
const passport = require('passport');// 用户认证模块passport
const Strategy = require('passport-http-bearer').Strategy;// token验证模块
const routes = require('./routes');
const config = require('./config');
const cors = require('cors')
const log4js = require('./middleware/logs')
const logger = log4js.getLogger() //根据需要获取logger
let port = config.port || 8080;
const createError = require("http-errors");

const http = require('http')
// 数据库连接
require('./models/db')
app.use(cors())
app.use(passport.initialize());// 初始化passport模块
app.use(morgan('dev'));// 命令行中显示程序运行日志,便于bug调试

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

routes(app);

app.use(function(req, res, next) {
  let error = createError(404);
  logger.error(req.url, error)
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  let result =
    process.env.NODE_ENV === "development"
      ? {
          error: {
            message: err.message,
            name: error.name,
            stack: err.stack
          }
        }
      : {};
  logger.error(req.url, err)
  res.status(err.status || 500);
  res.json(result);
});

process.on('uncaughtException', err => {
  //do something
  logger.error("uncaughtException", err)
  process.exit(1);
});
app.listen(port, () => {
  console.log('listening on port : ' + port);
})
