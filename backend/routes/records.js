const express = require('express');
const router = express.Router();

// 获取违纪记录列表
router.get('/violations', (req, res) => {
    // 模拟数据 (后续会从数据库获取)
    const mockData = [
        {
            id: 1,
            class: '2023.1',
            teacher: '王振宽',
            type: '宿舍',
            situation: '401宿舍内务不整',
            score: -1,
            time: '10:00',
            remark: '阳台门西侧上铺没叠被子',
            createdAt: '2025-01-21T10:00:00Z'
        },
        {
            id: 2,
            class: '2023.2',
            teacher: '郭宝伟',
            type: '宿舍',
            situation: '407宿舍内务不整',
            score: -1,
            time: '10:00',
            remark: '宿舍门西侧下铺床上放东西',
            createdAt: '2025-01-21T10:00:00Z'
        },
        {
            id: 3,
            class: '2023.16',
            teacher: '刘世斌',
            type: '宿舍',
            situation: 'xxx宿舍内务不整',
            score: -1,
            time: '10:00',
            remark: '没拖地',
            createdAt: '2025-01-21T10:00:00Z'
        },
        {
            id: 4,
            class: '2023.21',
            teacher: '王树琦',
            type: '宿舍',
            situation: '318宿舍内务不整',
            score: -1,
            time: '10:00',
            remark: '洗手池脏',
            createdAt: '2025-01-21T10:00:00Z'
        },
        {
            id: 5,
            class: '2023.22',
            teacher: '袁义国',
            type: '宿舍',
            situation: '517宿舍学生打架',
            score: -1,
            time: '10:00',
            remark: '无',
            createdAt: '2025-01-21T10:00:00Z'
        },
        {
            id: 6,
            class: '2023.24',
            teacher: '王思程',
            type: '班级',
            situation: '学生自习课睡觉',
            score: -1,
            time: '10:00',
            remark: '无',
            createdAt: '2025-01-21T10:00:00Z'
        }
    ];
    
    res.json({
        success: true,
        message: '获取违纪记录成功',
        data: {
            records: mockData,
            total: mockData.length,
            page: 1,
            pageSize: 50
        }
    });
});

// 添加违纪记录
router.post('/violations', (req, res) => {
    const { class: className, teacher, type, situation, score, time, remark } = req.body;
    
    console.log('添加违纪记录:', req.body);
    
    // 这里后续会插入数据库
    res.json({
        success: true,
        message: '添加违纪记录成功',
        data: {
            id: Date.now(), // 临时ID
            class: className,
            teacher,
            type,
            situation,
            score,
            time,
            remark,
            createdAt: new Date().toISOString()
        }
    });
});

// 更新违纪记录
router.put('/violations/:id', (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`更新违纪记录 ID: ${id}`, updateData);
    
    res.json({
        success: true,
        message: '更新违纪记录成功',
        data: {
            id: parseInt(id),
            ...updateData,
            updatedAt: new Date().toISOString()
        }
    });
});

// 删除违纪记录
router.delete('/violations/:id', (req, res) => {
    const { id } = req.params;
    
    console.log(`删除违纪记录 ID: ${id}`);
    
    res.json({
        success: true,
        message: '删除违纪记录成功',
        data: {
            id: parseInt(id)
        }
    });
});

module.exports = router;