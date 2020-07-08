module.exports = {
  'secret': 'colbugs', // used when we create and verify JSON Web Tokens
  'database': 'mongodb://localhost:27017/colbugs', // 数据库表名
  'port': 8083,
  'tokentimeout': '7d' // 用户体系过期时间，默认为7天
};
