const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// 设置静态文件目录 - 将整个frontend目录作为静态资源
app.use(express.static(__dirname));

// 根路径路由，返回index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`前端服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭处理
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    process.exit(0);
});