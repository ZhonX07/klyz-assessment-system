const express = require('express');
const router = express.Router();

// 获取管理员信息
router.get('/profile', (req, res) => {
    // 这里后续会添加JWT验证中间件
    res.json({
        success: true,
        message: '获取管理员信息成功',
        data: {
            username: '示例用户',
            userType: 'normal',
            lastLogin: new Date().toISOString()
        }
    });
});

// 获取管理员权限
router.get('/permissions', (req, res) => {
    // 根据用户类型返回不同权限
    res.json({
        success: true,
        message: '获取权限信息成功',
        data: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canExport: true
        }
    });
});

module.exports = router;