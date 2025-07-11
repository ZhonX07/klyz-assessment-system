const express = require('express');
const router = express.Router();

// 用户登录验证
router.post('/login', (req, res) => {
    const { username } = req.body;
    
    console.log(`登录尝试: ${username}`);
    
    // 临时用户验证逻辑 (后续会连接数据库)
    const users = {
        '郭宝伟': { type: 'normal', name: '郭宝伟' },
        '王树琦': { type: 'edit', name: '王树琦' }
    };
    
    if (users[username]) {
        res.json({
            success: true,
            message: '用户验证成功',
            data: {
                userType: users[username].type,
                userName: users[username].name
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: '用户名不存在，请联系管理员'
        });
    }
});

// 密码验证 (普通管理员)
router.post('/verify-password', (req, res) => {
    const { username, password } = req.body;
    
    console.log(`密码验证: ${username}`);
    
    // 临时密码验证 (后续会使用bcrypt加密)
    if (username === '郭宝伟' && password === 'admin123') {
        res.json({
            success: true,
            message: '密码验证成功',
            data: {
                token: 'temp_token_normal_admin',
                userType: 'normal',
                userName: '郭宝伟'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: '密码错误，请重新输入'
        });
    }
});

// TOTP验证 (编辑管理员)
router.post('/verify-totp', (req, res) => {
    const { username, code } = req.body;
    
    console.log(`TOTP验证: ${username}, 验证码: ${code}`);
    
    // 临时验证码验证
    if (username === '王树琦' && code === '123456') {
        res.json({
            success: true,
            message: '验证码验证成功',
            data: {
                token: 'temp_token_edit_admin',
                userType: 'edit',
                userName: '王树琦'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: '验证码错误，请重新输入'
        });
    }
});

module.exports = router;