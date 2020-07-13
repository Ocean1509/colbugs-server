/**
 * 错误上报接口，需要带项目唯一uuid
 */
const express = require('express');
const Report = require('../models/report');
const Project = require('../models/project')
const router = express.Router();
const bodyParser = require('body-parser');
const log4js = require('./middleware/logs')
const Logger = log4js.getLogger() //根据需要获取logger
const parser = bodyParser.json({
    type: 'text/plain'
})
router.post('/', parser, function (req, res) {
    let params = req.body
    // TODO ip处理
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    Logger.error(ip)
    let uuid = params.apiKey;
    if (!uuid) return res.send('no apikey')

    // TODO: 同个类型，同个ip的信息错误信息触发多次
    Project.findOne({
        uuid
    }, (err, project) => {
        if (err) {
            throw err;
        }
        if (!project) {
            return res.send('apikey is no exit')
        } else {
            // TODO: 接口校验
            params.createAt = Date.now()
            params.ip = ip
            params.apiKey = uuid
            var newProject = new Report(params)
            newProject.save((err) => {
                if (err) {
                    return res.send('write error');
                }
                return res.send('write success')
            })
        }
    })
})

module.exports = router