const { Schema } = require("mongoose");
const mongoose = require("./db");

const ReportSchema = new Schema({
    title: String,
    url: String,
    language: String, // 语言
    platform: String, // 操作系统
    userAgent: String, // 浏览器引擎
    queues: Array, // 用户行为堆栈
    performance: Object, // 页面性能
    type: {
        type: String,
        index: true
    }, // 错误类型
    message: String, // 错误信息
    target: Object, // resource error详细错误
    stacktrace: String, // 错误堆栈信息
    name: String,
    row: Number,
    col: Number,
    statusText: String,
    status: String,
    withCredentials: Boolean,
    timeout: Number,
    body: Object,
    method: String,
    startSend: Number,
    fetchType: String,
    endSend: Number,
    ip: String,
    projectId: {
        type: String,
        index: true
    },
    apiKey: {
        type: String,
        index: true
    },
    createAt: {
        type: Number,
        index: true
    }
})

module.exports = mongoose.model('Report', ReportSchema)