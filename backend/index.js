const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// 日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 基础路由
app.get('/', (req, res) => {
    res.json({
        message: '垦利一中班级量化管理系统 API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API路由组
app.use('/api/auth', require('./routes/auth')); // 认证相关路由
app.use('/api/admin', require('./routes/admin')); // 管理员相关路由
app.use('/api/records', require('./routes/records')); // 记录相关路由
app.use('/api/users', require('./routes/users')); // 用户管理路由

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'API接口不存在',
        path: req.originalUrl
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : '请联系管理员'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 后端服务器启动成功`);
    console.log(`📍 运行地址: http://localhost:${PORT}`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log(`🏫 垦利一中班级量化管理系统 v1.0.0`);
    console.log(`=================================`);
});

// 优雅关闭处理
process.on('SIGINT', () => {
    console.log('\n⏹️  正在关闭后端服务器...');
    process.exit(0);
});

module.exports = app;