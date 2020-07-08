/**
 * 用户体系，登录获取用户token，后续管理平台相关操作需要带上token
 */
const express = require('express');
const User = require('../models/user');
const Project = require('../models/project')
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');
const router = express.Router();
const uuid = require('node-uuid')

require('../passport')(passport);

// 检查用户名与密码并生成一个accesstoken如果验证通过
router.post('/accesstoken', (req, res) => {
  console.log('login', typeof req.body, req.body, req.body.username)
  if (req.body && req.body.username) {
    return User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        res.json({
          success: false,
          message: '认证失败,用户不存在!'
        });
      } else if (user) {
        // 检查密码是否正确
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // todo 不会过期
            var token = jwt.sign({
              username: user.username
            }, config.secret, {
              expiresIn: 50000000 // token 过期销毁时间设置 - 七天
            });
            user.token = token;
            user.save(function (err) {
              if (err) {
                res.send(err);
              }
            });
            res.json({
              success: true,
              message: '验证成功!',
              token,
              username: user.username
            });
          } else {
            res.send({
              success: false,
              message: '认证失败,密码错误!'
            });
          }
        });
      }
    });
  } else {
    return res.json({ success: false, message: "username is not exit"})
  }
});

// 创建项目
router.post('/newproject',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
    const body = req.body;
    if (!body.name) res.json({
      message: '请输入项目名称',
      success: false
    })
    let name = body.name;
    let info = body.info || '';
    Project.findOne({
      name
    }, (err, project) => {
      if (err) {
        throw err;
      }
      if (project) {
        return res.json({
          success: false,
          message: '项目已存在'
        });
      }
      let id = uuid.v1()
      var newProject = new Project({
        name,
        info,
        uuid: id
      })
      newProject.save((err) => {
        if (err) {
          return res.json({
            success: false,
            message: `创建失败! ${err}`
          });
        }
        return res.json({
          success: true,
          message: '创建项目成功',
          uuid: id
        });
      });
    })
  });

// 获取项目列表
router.get('/allprojects', passport.authenticate('bearer', {
  session: false
}), function (req, res) {
  Project.find({}, ['name', 'info', 'uuid'], (err, projects) => {
    if (err) {
      return res.json({
        success: false,
        message: `获取失败！${err}`
      })
    }
    if (projects.length) {
      return res.send(projects)
    } else {
      return res.send([])
    }
  })
})


// 注册账户 - 后续拓展将接口放出
// router.post('/signup', (req, res) => {
//   if (!req.body.username || !req.body.password) {
//     res.json({success: false, message: '请输入您的账号密码.'});
//   } else {
//     var newUser = new User({
//       username: req.body.username,
//       password: req.body.password
//     });
//     // 保存用户账号
//     newUser.save((err) => {
//       if (err) {
//         return res.json({success: false, message: '注册失败!'});
//       }
//       res.json({success: true, message: '成功创建新用户!'});
//     });
//   }
// });

module.exports = router;