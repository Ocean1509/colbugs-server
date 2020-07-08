const express = require('express');
const Report = require('../models/report');
const Project = require('../models/project')
const router = express.Router();
const passport = require('passport');

require('../passport')(passport);

router.get('/nums', passport.authenticate('bearer', {
    session: false
}), function (req, res) {
    let type = req.query.type
    let apiKey = req.query.apiKey;
    const limit = {};
    if (type) limit["type"] = type;
    if (apiKey) limit["apiKey"] = apiKey
    return Report.count(limit, (err, counts) => {
        res.send({
            n: counts
        })
    })
})
router.get('/all', passport.authenticate('bearer', {
    session: false
}), function (req, res) {
    let id = req.query.id;
    let type = req.query.type;
    let pageNum = req.query.pn || 1;
    let pageSize = req.query.ps || 10

    const limit = {};
    if (id) limit['apiKey'] = id.toString();
    if (type) limit['type'] = type;
    /**
     * pageNum 默认从0开始  pageSize 10页面
     */
    Report.count(limit, (err, count) => { //查询出结果返回
        Report.find(limit, {
                title: 1,
                url: 1,
                type: 1,
                message: 1,
                createAt: 1,
                status: 1,
                method: 1,
                statusText: 1,
                timeout: 1,
                startSend: 1,
                endSend: 1
            })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)

            .sort({
                'createAt': -1
            })
            .exec((err, doc) => {
                if (err) {
                    throw err
                }
                if (doc) {
                    return res.send(doc)
                }
            })
    })

})

router.get('/detail/:id', passport.authenticate('bearer', {
    session: false
}), function (req, res) {
    let id = req.params.id;
    if (!id) res.send({})
    return Report.find({
        _id: id.toString()
    }, (err, r) => {
        if (err) return res.json({
            success: false,
            message: "查询失败"
        })
        if (!r) {
            return res.json({
                success: false
            })
        }
        return res.json({
            success: true,
            data: r[0]
        })
    })
})

module.exports = router;