// 登录模态框相关功能
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// 登录表单提交处理
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const submitButton = this.querySelector('button[type="submit"]');
    
    // 临时用户验证逻辑 (后续会连接后端API)
    if (username === '郭宝伟' || username === '王树琦') {
        // 显示按钮内加载动画
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // 清空表单并关闭模态框
            this.reset();
            closeLoginModal();
            
            if (username === '郭宝伟') {
                window.location.href = '/HTML/normaladmin.html';
            } else {
                window.location.href = '/HTML/editadmin.html';
            }
        }, 3000);
    } else {
        alert('用户名不存在，请联系管理员！');
        return;
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('垦利一中班级量化管理系统已加载');
});