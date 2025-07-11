// API基础URL
const API_BASE = 'http://localhost:3000/api';

// DOM元素
const userTableBody = document.getElementById('userTableBody');
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const modalTitle = document.getElementById('modalTitle');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadUserList();
    initEventListeners();
});

// 初始化事件监听器
function initEventListeners() {
    // 表单提交事件
    userForm.addEventListener('submit', handleFormSubmit);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === userModal) {
            closeUserModal();
        }
    });
}

// 显示加载动画
function showLoading() {
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.style.display = 'flex';
}

// 隐藏加载动画
function hideLoading() {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.style.display = 'none';
}

// 加载用户列表
async function loadUserList() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        
        if (data.success) {
            renderUserTable(data.data);
        } else {
            alert('获取用户列表失败: ' + data.message);
        }
    } catch (error) {
        console.error('获取用户列表错误:', error);
        alert('获取用户列表失败，请检查后端服务是否启动');
    } finally {
        hideLoading();
    }
}

// 渲染用户表格
function renderUserTable(users) {
    userTableBody.innerHTML = '';
    
    if (users.length === 0) {
        userTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #7f8c8d;">
                    暂无用户数据
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const accessMap = {
            'user': '普通用户',
            'editadmin': '编辑管理员', 
            'root': '超级管理员'
        };
        
        const authType = user.has_password ? '密码认证' : (user.has_2fa ? '2FA认证' : '未设置');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <span class="access-badge access-${user.access}">
                    ${accessMap[user.access] || user.access}
                </span>
            </td>
            <td>${user.belonggrade}级</td>
            <td>
                <span class="auth-badge auth-${user.has_password ? 'password' : (user.has_2fa ? '2fa' : 'none')}">
                    ${authType}
                </span>
            </td>
            <td>
                <span class="status-badge status-${user.is_active ? 'active' : 'inactive'}">
                    ${user.is_active ? '活跃' : '禁用'}
                </span>
            </td>
            <td>${formatDateTime(user.created_at)}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editUser(${user.id})">编辑</button>
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">删除</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// 格式化日期时间
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
}

// 显示添加用户模态框
function showAddUserModal() {
    modalTitle.textContent = '添加用户';
    userForm.reset();
    document.getElementById('userId').value = '';
    document.querySelectorAll('input[name="authType"]').forEach(radio => radio.checked = false);
    toggleAuthFields();
    userModal.style.display = 'block';
}

// 切换认证字段显示
function toggleAuthFields() {
    const passwordRadio = document.querySelector('input[name="authType"][value="password"]');
    const tfaRadio = document.querySelector('input[name="authType"][value="2fa"]');
    const passwordGroup = document.getElementById('passwordGroup');
    const tfaGroup = document.getElementById('tfaGroup');
    
    if (passwordRadio.checked) {
        passwordGroup.style.display = 'block';
        tfaGroup.style.display = 'none';
        document.getElementById('userPassword').required = true;
        document.getElementById('userTfaKey').required = false;
    } else if (tfaRadio.checked) {
        passwordGroup.style.display = 'none';
        tfaGroup.style.display = 'block';
        document.getElementById('userPassword').required = false;
        document.getElementById('userTfaKey').required = true;
    } else {
        passwordGroup.style.display = 'none';
        tfaGroup.style.display = 'none';
        document.getElementById('userPassword').required = false;
        document.getElementById('userTfaKey').required = false;
    }
}

// 编辑用户
async function editUser(userId) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        
        if (data.success) {
            const user = data.data.find(u => u.id === userId);
            if (user) {
                modalTitle.textContent = '编辑用户';
                document.getElementById('userId').value = user.id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userAccess').value = user.access;
                document.getElementById('belongGrade').value = user.belonggrade;
                
                // 设置认证类型
                if (user.has_password) {
                    document.querySelector('input[name="authType"][value="password"]').checked = true;
                } else if (user.has_2fa) {
                    document.querySelector('input[name="authType"][value="2fa"]').checked = true;
                }
                toggleAuthFields();
                
                userModal.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('获取用户信息错误:', error);
        alert('获取用户信息失败');
    } finally {
        hideLoading();
    }
}

// 删除用户
async function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复。')) {
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('删除用户成功');
            loadUserList();
        } else {
            alert('删除用户失败: ' + data.message);
        }
    } catch (error) {
        console.error('删除用户错误:', error);
        alert('删除用户失败');
    } finally {
        hideLoading();
    }
}

// 关闭用户模态框
function closeUserModal() {
    userModal.style.display = 'none';
    userForm.reset();
}

// 处理表单提交
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(userForm);
    const authType = document.querySelector('input[name="authType"]:checked')?.value;
    
    const userData = {
        name: formData.get('name'),
        access: formData.get('access'),
        belonggrade: parseInt(formData.get('belonggrade')),
        pswd: authType === 'password' ? formData.get('pswd') : null,
        twofakey: authType === '2fa' ? formData.get('twofakey') : null
    };
    
    // 验证必填字段
    if (!userData.name || !userData.access || !userData.belonggrade) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 验证认证方式
    if (!authType) {
        alert('请选择认证方式');
        return;
    }
    
    if (authType === 'password' && !userData.pswd) {
        alert('请输入密码');
        return;
    }
    
    if (authType === '2fa' && !userData.twofakey) {
        alert('请输入2FA密钥');
        return;
    }
    
    const userId = document.getElementById('userId').value;
    const isEdit = Boolean(userId);
    
    showLoading();
    try {
        const url = isEdit ? `${API_BASE}/users/${userId}` : `${API_BASE}/users`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(isEdit ? '更新用户成功' : '添加用户成功');
            closeUserModal();
            loadUserList();
        } else {
            alert((isEdit ? '更新用户失败: ' : '添加用户失败: ') + data.message);
        }
    } catch (error) {
        console.error('保存用户错误:', error);
        alert('保存用户失败');
    } finally {
        hideLoading();
    }
}

// 刷新用户列表
function refreshUserList() {
    loadUserList();
}