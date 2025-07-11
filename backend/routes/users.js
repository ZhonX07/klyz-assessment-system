const express = require('express');
const UserDatabase = require('../database/user/userDb');
const router = express.Router();

// 创建数据库实例
const userDb = new UserDatabase();

// 获取所有用户
router.get('/', (req, res) => {
    try {
        const users = userDb.getAllUsers();
        res.json({
            success: true,
            message: '获取用户列表成功',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取用户列表失败',
            error: error.message
        });
    }
});

// 添加用户
router.post('/', (req, res) => {
    try {
        const { name, access, belonggrade, pswd, twofakey } = req.body;
        
        if (!name || !access || !belonggrade) {
            return res.status(400).json({
                success: false,
                message: '用户名、权限和所属学部为必填项'
            });
        }
        
        const result = userDb.addUser({
            name,
            access,
            belonggrade,
            pswd,
            twofakey
        });
        
        if (result.success) {
            res.json({
                success: true,
                message: '添加用户成功',
                data: { id: result.id }
            });
        } else {
            res.status(400).json({
                success: false,
                message: '添加用户失败',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 更新用户
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, access, belonggrade, pswd, twofakey } = req.body;
        
        const result = userDb.updateUser(id, {
            name,
            access,
            belonggrade,
            pswd,
            twofakey
        });
        
        if (result.success) {
            res.json({
                success: true,
                message: '更新用户成功',
                data: { changes: result.changes }
            });
        } else {
            res.status(400).json({
                success: false,
                message: '更新用户失败',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 删除用户
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const result = userDb.deleteUser(id);
        
        if (result.success) {
            res.json({
                success: true,
                message: '删除用户成功',
                data: { changes: result.changes }
            });
        } else {
            res.status(400).json({
                success: false,
                message: '删除用户失败',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

module.exports = router;