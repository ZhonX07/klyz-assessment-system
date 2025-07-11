const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class UserDatabase {
    constructor() {
        // 确保数据库目录存在
        this.dbDir = path.join(__dirname, '../../database/user');
        this.dbPath = path.join(this.dbDir, 'user.db');
        
        if (!fs.existsSync(this.dbDir)) {
            fs.mkdirSync(this.dbDir, { recursive: true });
        }
        
        // 初始化数据库连接
        this.db = new Database(this.dbPath);
        this.db.pragma('journal_mode = WAL');
        
        // 初始化表结构
        this.initTables();
        
        console.log(`📊 用户数据库已连接: ${this.dbPath}`);
    }
    
    // 初始化表结构
    initTables() {
        // 用户表
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                access TEXT NOT NULL CHECK(access IN ('user', 'editadmin', 'root')),
                belonggrade INTEGER NOT NULL,
                pswd TEXT,
                twofakey TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                CHECK (
                    (pswd IS NOT NULL AND twofakey IS NULL) OR 
                    (pswd IS NULL AND twofakey IS NOT NULL)
                )
            )
        `);
        
        // 会话表
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);
        
        // 插入默认用户（如果不存在）
        this.insertDefaultUsers();
    }
    
    // 插入默认用户
    insertDefaultUsers() {
        const defaultUsers = [
            {
                name: '郭宝伟',
                access: 'user',
                belonggrade: 2023,
                pswd: 'Admin123456', // 需要8位包含大小写字母
                twofakey: null
            },
            {
                name: '王树琦',
                access: 'editadmin',
                belonggrade: 2023,
                pswd: null,
                twofakey: 'JBSWY3DPEHPK3PXP' // 示例2FA密钥
            },
            {
                name: 'root',
                access: 'root',
                belonggrade: 2023,
                pswd: 'RootPassword123',
                twofakey: null
            }
        ];
        
        const insertUser = this.db.prepare(`
            INSERT OR IGNORE INTO users (name, access, belonggrade, pswd, twofakey)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        defaultUsers.forEach(user => {
            insertUser.run(
                user.name,
                user.access,
                user.belonggrade,
                user.pswd,
                user.twofakey
            );
        });
    }
    
    // 获取所有用户
    getAllUsers() {
        const stmt = this.db.prepare(`
            SELECT id, name, access, belonggrade, 
                   CASE WHEN pswd IS NOT NULL THEN 1 ELSE 0 END as has_password,
                   CASE WHEN twofakey IS NOT NULL THEN 1 ELSE 0 END as has_2fa,
                   is_active, created_at, updated_at
            FROM users ORDER BY id ASC
        `);
        return stmt.all();
    }
    
    // 根据用户名获取用户
    getUserByName(name) {
        const stmt = this.db.prepare(`
            SELECT * FROM users WHERE name = ? AND is_active = 1
        `);
        return stmt.get(name);
    }
    
    // 验证密码格式
    validatePassword(password) {
        if (!password || password.length < 8) {
            return { valid: false, message: '密码长度至少8位' };
        }
        
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        
        if (!hasLower || !hasUpper) {
            return { valid: false, message: '密码必须包含大小写字母' };
        }
        
        return { valid: true };
    }
    
    // 添加用户
    addUser(userData) {
        // 验证数据
        if (!userData.name || !userData.access || !userData.belonggrade) {
            return { success: false, error: '用户名、权限和所属学部为必填项' };
        }
        
        // 检查权限值
        if (!['user', 'editadmin', 'root'].includes(userData.access)) {
            return { success: false, error: '权限值必须是 user、editadmin 或 root' };
        }
        
        // 验证密码和2FA密钥只能存在一个
        const hasPassword = userData.pswd && userData.pswd.trim();
        const has2FA = userData.twofakey && userData.twofakey.trim();
        
        if (!hasPassword && !has2FA) {
            return { success: false, error: '密码和2FA密钥必须设置其中一个' };
        }
        
        if (hasPassword && has2FA) {
            return { success: false, error: '密码和2FA密钥只能设置其中一个' };
        }
        
        // 如果有密码，验证密码格式
        if (hasPassword) {
            const passwordValidation = this.validatePassword(userData.pswd);
            if (!passwordValidation.valid) {
                return { success: false, error: passwordValidation.message };
            }
        }
        
        const stmt = this.db.prepare(`
            INSERT INTO users (name, access, belonggrade, pswd, twofakey)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        try {
            const result = stmt.run(
                userData.name,
                userData.access,
                parseInt(userData.belonggrade),
                hasPassword ? userData.pswd : null,
                has2FA ? userData.twofakey : null
            );
            return { success: true, id: result.lastInsertRowid };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // 更新用户
    updateUser(id, userData) {
        // 验证密码和2FA密钥只能存在一个
        const hasPassword = userData.pswd && userData.pswd.trim();
        const has2FA = userData.twofakey && userData.twofakey.trim();
        
        if (hasPassword && has2FA) {
            return { success: false, error: '密码和2FA密钥只能设置其中一个' };
        }
        
        // 如果有密码，验证密码格式
        if (hasPassword) {
            const passwordValidation = this.validatePassword(userData.pswd);
            if (!passwordValidation.valid) {
                return { success: false, error: passwordValidation.message };
            }
        }
        
        const stmt = this.db.prepare(`
            UPDATE users 
            SET name = ?, access = ?, belonggrade = ?, 
                pswd = ?, twofakey = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        try {
            const result = stmt.run(
                userData.name,
                userData.access,
                parseInt(userData.belonggrade),
                hasPassword ? userData.pswd : null,
                has2FA ? userData.twofakey : null,
                id
            );
            return { success: true, changes: result.changes };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // 删除用户（软删除）
    deleteUser(id) {
        const stmt = this.db.prepare(`
            UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `);
        
        try {
            const result = stmt.run(id);
            return { success: true, changes: result.changes };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // 关闭数据库连接
    close() {
        this.db.close();
        console.log('📊 用户数据库连接已关闭');
    }
}

module.exports = UserDatabase;