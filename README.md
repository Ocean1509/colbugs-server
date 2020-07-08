### 初始化

#### 数据库连接配置
  ```config.js```

#### 创建管理员用户
```use colbugs```

```
db.users.insert({
   "password": "$2b$10$ExGprP7t5JsWI/iLQnmDu.H4iR.gFfL6F2nTY2vQTOPG9e0AWLyG6",
   "username": "admin",
   "create_at": 1465206116175,
   "type": 1
})
```

管理员账户密码：
username： admin
password： myquant@123


### 接口

* 用户登录
    * POST /accesstoken: 根据管理员账户生成token
    * POST /newproject:  创建项目
    * GET /allprojects: 获取项目列表

* 错误上报
    * POST /report

* 后台可视化
   * GET /api/nums： 获取错误条数
   * GET /api/all:   获取所有错误，支持分页，分类
   * GET /detail/:id: 获取错误详情